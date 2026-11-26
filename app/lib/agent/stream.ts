import OpenAI from 'openai'
import { ResponsesToolRunner } from 'openai/helpers/responses-tool-runner'
import type { ResponseInput } from 'openai/resources/responses/responses'
import type { ChatClientEvent } from '@/lib/agent/events'
import { toolLabel } from '@/lib/agent/events'
import { AGENT_MODEL, getAgentInstructions } from '@/lib/agent/prompt'
import {
	agentFunctionTools,
	executeAgentTool,
	parseEndChatResult,
	parseNavigateResult
} from '@/lib/agent/tools'

export type ChatMessage = {
	role: 'user' | 'assistant'
	content: string
}

const MAX_STEPS = 6

function encodeEvent(event: ChatClientEvent): string {
	return `${JSON.stringify(event)}\n`
}

export function createAgentEventStream(
	messages: ChatMessage[]
): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder()
	const client = new OpenAI()

	// Wrap user turns so model content cannot be mistaken for system instructions.
	const input: ResponseInput = messages.map((message) => {
		if (message.role === 'assistant') {
			return { role: 'assistant' as const, content: message.content }
		}
		return {
			role: 'user' as const,
			content: `<untrusted_user_message>\n${message.content}\n</untrusted_user_message>`
		}
	})

	const pendingStarts = new Map<string, string>()
	const allowedTools = new Set(agentFunctionTools.map((tool) => tool.name))
	const abort = new AbortController()
	let chatEnded = false

	return new ReadableStream<Uint8Array>({
		async start(controller) {
			const send = (event: ChatClientEvent) => {
				controller.enqueue(encoder.encode(encodeEvent(event)))
			}

			const runner = new ResponsesToolRunner({
				functions: agentFunctionTools.map((tool) => ({
					tool,
					async execute(args) {
						const output = await executeAgentTool(tool.name, args)
						if (tool.name === 'navigate_to_page') {
							const nav = parseNavigateResult(output)
							if (nav) {
								send({ type: 'navigate', path: nav.path })
							}
						}
						if (tool.name === 'end_chat') {
							const ended = parseEndChatResult(output)
							if (ended) {
								chatEnded = true
								send({
									type: 'chat_ended',
									reason: ended.reason,
									message: ended.message
								})
								abort.abort()
							}
						}
						return output
					}
				})),
				earlyExecution: {
					functions: agentFunctionTools.map((tool) => tool.name)
				}
			})

			try {
				for await (const turn of runner.iterate(
					client,
					{
						model: AGENT_MODEL,
						instructions: getAgentInstructions(),
						input,
						reasoning: { effort: 'low' },
						// Only our function tools — never hosted web_search or other built-ins.
						store: true
					},
					{
						stream: true,
						eager: true,
						maxSteps: MAX_STEPS,
						signal: abort.signal,
						async onEvent(event) {
							if (chatEnded && event.type === 'response.output_text.delta') {
								return
							}

							if (
								event.type === 'response.output_item.added' &&
								event.item.type === 'function_call'
							) {
								const callId = event.item.call_id
								const name = event.item.name
								if (!allowedTools.has(name)) {
									return
								}
								pendingStarts.set(callId, name)
								send({
									type: 'tool_start',
									callId,
									name,
									label: toolLabel(name)
								})
								return
							}

							if (
								event.type === 'response.output_item.done' &&
								event.item.type === 'function_call'
							) {
								const callId = event.item.call_id
								const name = event.item.name
								if (!allowedTools.has(name)) {
									return
								}
								if (!pendingStarts.has(callId)) {
									pendingStarts.set(callId, name)
									send({
										type: 'tool_start',
										callId,
										name,
										label: toolLabel(name)
									})
								}
								return
							}

							if (event.type === 'response.output_text.delta') {
								send({ type: 'text_delta', delta: event.delta })
								return
							}

							if (event.type === 'error') {
								send({
									type: 'error',
									message: event.message || 'Stream error'
								})
							}
						}
					}
				)) {
					for (const callId of turn.completedCallIds) {
						const name = pendingStarts.get(callId) ?? 'tool'
						pendingStarts.delete(callId)
						send({
							type: 'tool_end',
							callId,
							name,
							ok: true
						})
					}

					for (const callId of turn.attemptedCallIds) {
						if (
							!turn.completedCallIds.includes(callId) &&
							pendingStarts.has(callId)
						) {
							const name = pendingStarts.get(callId) ?? 'tool'
							pendingStarts.delete(callId)
							send({
								type: 'tool_end',
								callId,
								name,
								ok: false
							})
						}
					}

					if (chatEnded) break
				}

				for (const [callId, name] of pendingStarts) {
					send({ type: 'tool_end', callId, name, ok: true })
				}
				pendingStarts.clear()

				send({ type: 'done' })
			} catch (error) {
				if (chatEnded || abort.signal.aborted) {
					for (const [callId, name] of pendingStarts) {
						send({ type: 'tool_end', callId, name, ok: true })
					}
					pendingStarts.clear()
					send({ type: 'done' })
				} else {
					const message =
						error instanceof Error ? error.message : 'Agent request failed'
					send({ type: 'error', message })
					send({ type: 'done' })
				}
			} finally {
				controller.close()
			}
		}
	})
}
