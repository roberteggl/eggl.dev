'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
	Check,
	LoaderCircle,
	Maximize2,
	MessageSquare,
	Minimize2,
	RotateCcw,
	Send,
	Sparkles,
	X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import type { ChatClientEvent } from '@/lib/agent/events'
import { cn } from '@/lib/utils'
import AgentMessageContent from './agent-message-content'
import { revealEase } from './reveal'

type ToolChip = {
	callId: string
	name: string
	label: string
	status: 'running' | 'done' | 'error'
}

type ChatLine = {
	id: string
	role: 'agent' | 'user'
	text: string
	tools?: ToolChip[]
}

const GREETING: ChatLine = {
	id: 'greeting',
	role: 'agent',
	text: 'Hey — I’m the **Eggl agent**. Ask about projects, posts, GitHub, or how to reach Robert.'
}

const HISTORY_LIMIT = 12

const panelEase = revealEase

function parseNdjsonChunk(
	buffer: string,
	onEvent: (event: ChatClientEvent) => void
): string {
	const parts = buffer.split('\n')
	const rest = parts.pop() ?? ''
	for (const part of parts) {
		const line = part.trim()
		if (!line) continue
		try {
			onEvent(JSON.parse(line) as ChatClientEvent)
		} catch {
			// ignore malformed lines
		}
	}
	return rest
}

export default function AgentChatTeaser() {
	const router = useRouter()
	const panelId = useId()
	const inputId = useId()
	const [open, setOpen] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [draft, setDraft] = useState('')
	const [lines, setLines] = useState<ChatLine[]>([GREETING])
	const [replying, setReplying] = useState(false)
	const [activeTools, setActiveTools] = useState<ToolChip[]>([])
	const [chatEnded, setChatEnded] = useState(false)
	const [desktop, setDesktop] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const launcherRef = useRef<HTMLButtonElement>(null)
	const logEndRef = useRef<HTMLDivElement>(null)
	const agentLineIdRef = useRef<string | null>(null)
	const chatEndedRef = useRef(false)

	useEffect(() => {
		const media = window.matchMedia('(min-width: 768px)')
		const sync = () => setDesktop(media.matches)
		sync()
		media.addEventListener('change', sync)
		return () => media.removeEventListener('change', sync)
	}, [])

	useEffect(() => {
		if (!open || chatEnded) return
		const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180)
		return () => window.clearTimeout(focusTimer)
	}, [open, chatEnded])

	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}, [lines, replying, activeTools, open, chatEnded, expanded])

	useEffect(() => {
		if (!open) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				if (expanded) {
					setExpanded(false)
					return
				}
				setOpen(false)
				launcherRef.current?.focus()
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open, expanded])

	const close = () => {
		setOpen(false)
		setExpanded(false)
		requestAnimationFrame(() => launcherRef.current?.focus())
	}

	const openPanel = () => {
		setOpen(true)
	}

	const clearChat = () => {
		if (replying) return
		chatEndedRef.current = false
		agentLineIdRef.current = null
		setChatEnded(false)
		setDraft('')
		setActiveTools([])
		setLines([GREETING])
		requestAnimationFrame(() => inputRef.current?.focus())
	}

	const canClear =
		!replying && (chatEnded || lines.some((line) => line.id !== 'greeting'))

	const patchAgentLine = (patch: (line: ChatLine) => ChatLine) => {
		const id = agentLineIdRef.current
		if (!id) return
		setLines((prev) =>
			prev.map((line) => (line.id === id ? patch(line) : line))
		)
	}

	const sendMessage = async () => {
		const text = draft.trim()
		if (!text || replying || chatEndedRef.current) return

		const userLine: ChatLine = {
			id: `user-${Date.now()}`,
			role: 'user',
			text
		}
		const agentId = `agent-${Date.now()}`
		agentLineIdRef.current = agentId

		const nextLines = [
			...lines,
			userLine,
			{ id: agentId, role: 'agent' as const, text: '', tools: [] }
		]
		setLines(nextLines)
		setDraft('')
		setReplying(true)
		setActiveTools([])

		const history = nextLines
			.filter((line) => line.id !== 'greeting' && line.text.trim())
			.filter((line) => line.role === 'user' || line.role === 'agent')
			.slice(-HISTORY_LIMIT)
			.map((line) => ({
				role:
					line.role === 'agent' ? ('assistant' as const) : ('user' as const),
				content: line.text
			}))
			// Drop the empty in-progress assistant placeholder from the request
			.filter((message) => message.content.length > 0)

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: history })
			})

			if (!response.ok || !response.body) {
				const payload = (await response.json().catch(() => null)) as {
					error?: string
				} | null
				throw new Error(payload?.error || `Request failed (${response.status})`)
			}

			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let buffer = ''

			const handleEvent = (event: ChatClientEvent) => {
				if (event.type === 'tool_start') {
					const chip: ToolChip = {
						callId: event.callId,
						name: event.name,
						label: event.label,
						status: 'running'
					}
					setActiveTools((prev) => {
						if (prev.some((tool) => tool.callId === chip.callId)) return prev
						return [...prev, chip]
					})
					patchAgentLine((line) => ({
						...line,
						tools: [
							...(line.tools ?? []).filter((t) => t.callId !== chip.callId),
							chip
						]
					}))
					return
				}

				if (event.type === 'tool_end') {
					setActiveTools((prev) =>
						prev.map((tool) =>
							tool.callId === event.callId
								? {
										...tool,
										status: event.ok ? 'done' : 'error'
									}
								: tool
						)
					)
					patchAgentLine((line) => ({
						...line,
						tools: (line.tools ?? []).map((tool) =>
							tool.callId === event.callId
								? {
										...tool,
										status: event.ok ? 'done' : 'error'
									}
								: tool
						)
					}))
					return
				}

				if (event.type === 'text_delta') {
					if (chatEndedRef.current) return
					patchAgentLine((line) => ({
						...line,
						text: `${line.text}${event.delta}`
					}))
					return
				}

				if (event.type === 'chat_ended') {
					chatEndedRef.current = true
					setChatEnded(true)
					setDraft('')
					patchAgentLine((line) => ({
						...line,
						text: line.text.trim() || event.message
					}))
					return
				}

				if (event.type === 'navigate') {
					router.push(event.path)
					close()
					return
				}

				if (event.type === 'error') {
					patchAgentLine((line) => ({
						...line,
						text: line.text.trim()
							? line.text
							: event.message || 'Something went wrong.'
					}))
				}
			}

			while (true) {
				const { done, value } = await reader.read()
				if (done) break
				buffer += decoder.decode(value, { stream: true })
				buffer = parseNdjsonChunk(buffer, handleEvent)
			}
			buffer = parseNdjsonChunk(`${buffer}\n`, handleEvent)

			if (!chatEndedRef.current) {
				patchAgentLine((line) => ({
					...line,
					text:
						line.text.trim() ||
						'Sorry — I couldn’t generate a reply. Try again in a moment.'
				}))
			}
		} catch (error) {
			if (!chatEndedRef.current) {
				const message =
					error instanceof Error ? error.message : 'Something went wrong.'
				patchAgentLine((line) => ({
					...line,
					text: line.text.trim() || message
				}))
			}
		} finally {
			setReplying(false)
			setActiveTools([])
			agentLineIdRef.current = null
		}
	}

	const showTyping =
		!chatEnded &&
		replying &&
		activeTools.every((tool) => tool.status !== 'running')

	return (
		<>
			<AnimatePresence>
				{open && expanded ? (
					<motion.button
						key="chat-backdrop"
						type="button"
						aria-label="Collapse chat"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.28, ease: panelEase }}
						onClick={() => setExpanded(false)}
						className="pointer-events-auto fixed inset-0 z-40 bg-background/40 backdrop-blur-[3px] md:bg-background/30"
					/>
				) : null}
			</AnimatePresence>

			<div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
				<AnimatePresence>
					{open ? (
						<motion.div
							key="panel"
							id={panelId}
							role="dialog"
							aria-modal={expanded}
							aria-labelledby={`${panelId}-title`}
							initial={{ opacity: 0, y: 18, scale: 0.97 }}
							animate={
								expanded
									? {
											opacity: 1,
											y: 0,
											x: 0,
											scale: 1,
											width: desktop ? '33.333333vw' : '100vw',
											height: '100dvh'
										}
									: {
											opacity: 1,
											y: 0,
											x: 0,
											scale: 1,
											width: 'min(calc(100vw - 2.5rem), 22rem)',
											height: 'min(70dvh, 32rem)'
										}
							}
							exit={{ opacity: 0, y: 14, scale: 0.98 }}
							transition={{ duration: 0.42, ease: panelEase }}
							className={cn(
								'pointer-events-auto',
								expanded
									? 'fixed inset-y-0 right-0 z-50 origin-right'
									: 'origin-bottom-right'
							)}
						>
							<div
								className={cn(
									'relative flex h-full w-full flex-col overflow-hidden border border-border/60 bg-card/85 backdrop-blur-2xl dark:border-border/50 dark:bg-card/80',
									expanded
										? 'rounded-none border-y-0 border-r-0 shadow-[-32px_0_80px_-28px_rgba(14,18,23,0.45)] md:rounded-l-[1.75rem] md:border-y md:border-l dark:shadow-[-40px_0_90px_-20px_rgba(0,0,0,0.7)]'
										: 'rounded-[1.35rem] shadow-[0_24px_60px_-28px_rgba(14,18,23,0.5)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]'
								)}
							>
								{expanded ? (
									<>
										<div
											aria-hidden
											className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]"
										/>
										<div
											aria-hidden
											className="pointer-events-none absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent"
										/>
									</>
								) : null}
								<div
									className={cn(
										'relative flex shrink-0 items-start justify-between gap-3 border-b border-border/50',
										expanded ? 'px-6 py-5 md:px-7 md:py-6' : 'px-4 py-3.5'
									)}
								>
									<div className="flex min-w-0 items-center gap-3">
										<span
											className={cn(
												'inline-flex shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/15',
												expanded ? 'size-11' : 'size-9'
											)}
										>
											<Sparkles
												size={expanded ? 18 : 16}
												strokeWidth={1.75}
												aria-hidden
											/>
										</span>
										<div className="min-w-0">
											<p
												id={`${panelId}-title`}
												className={cn(
													'font-medium tracking-tight text-foreground',
													expanded ? 'text-[17px]' : 'text-[15px]'
												)}
											>
												Eggl Agent
											</p>
											<p
												className={cn(
													'mt-0.5 text-muted-foreground',
													expanded ? 'text-[13px]' : 'text-[12px]'
												)}
											>
												{chatEnded
													? 'Chat ended'
													: expanded
														? 'Full conversation dock'
														: 'Projects, posts, and how Robert builds'}
											</p>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-0.5">
										<button
											type="button"
											onClick={clearChat}
											disabled={!canClear}
											aria-label="Clear chat"
											title="Clear chat"
											className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
										>
											<RotateCcw size={15} strokeWidth={1.75} />
										</button>
										<button
											type="button"
											onClick={() => setExpanded((value) => !value)}
											aria-label={expanded ? 'Collapse chat' : 'Expand chat'}
											aria-pressed={expanded}
											title={expanded ? 'Collapse' : 'Expand'}
											className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
										>
											{expanded ? (
												<Minimize2 size={15} strokeWidth={1.75} />
											) : (
												<Maximize2 size={15} strokeWidth={1.75} />
											)}
										</button>
										<button
											type="button"
											onClick={close}
											aria-label="Close agent chat"
											className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
										>
											<X size={16} strokeWidth={1.75} />
										</button>
									</div>
								</div>

								<div
									className={cn(
										'relative min-h-0 flex-1 overflow-y-auto',
										expanded ? 'px-6 py-6 md:px-7 md:py-7' : 'px-4 py-4'
									)}
								>
									<div
										role="log"
										aria-live="polite"
										aria-relevant="additions"
										className={cn(
											'flex flex-col',
											expanded ? 'gap-4' : 'gap-2.5'
										)}
									>
										{lines.map((line) => (
											<div
												key={line.id}
												className={cn(
													'flex flex-col gap-1.5',
													expanded ? 'max-w-[90%]' : 'max-w-[92%]',
													line.role === 'agent' ? 'self-start' : 'self-end'
												)}
											>
												{line.role === 'agent' &&
												line.tools &&
												line.tools.length > 0 ? (
													<div className="flex flex-wrap gap-1.5">
														{line.tools.map((tool) => (
															<span
																key={tool.callId}
																className={cn(
																	'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-tight',
																	tool.status === 'running'
																		? 'border-accent/30 bg-accent/10 text-accent'
																		: tool.status === 'error'
																			? 'border-destructive/30 bg-destructive/10 text-destructive'
																			: 'border-border/70 bg-surface-2 text-muted-foreground'
																)}
															>
																{tool.status === 'running' ? (
																	<LoaderCircle
																		size={10}
																		className="animate-spin"
																		aria-hidden
																	/>
																) : (
																	<Check size={10} aria-hidden />
																)}
																<span className="max-w-[14rem] truncate">
																	{tool.status === 'running'
																		? tool.label
																		: tool.name}
																</span>
															</span>
														))}
													</div>
												) : null}
												{line.text ? (
													<div
														className={cn(
															'rounded-2xl leading-relaxed',
															expanded
																? 'px-4 py-3 text-[15px]'
																: 'px-3.5 py-2 text-[13px]',
															line.role === 'agent'
																? 'rounded-bl-md bg-surface-2/90 text-foreground'
																: 'rounded-br-md bg-accent text-accent-foreground whitespace-pre-wrap'
														)}
													>
														{line.role === 'agent' ? (
															<AgentMessageContent
																text={line.text}
																onNavigate={close}
															/>
														) : (
															line.text
														)}
													</div>
												) : null}
											</div>
										))}
										{showTyping &&
										!lines.at(-1)?.text &&
										!lines.at(-1)?.tools?.length ? (
											<div
												role="status"
												className="flex self-start items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface-2/90 px-3.5 py-3"
											>
												<span className="sr-only">Agent is typing</span>
												<span
													className="size-1.5 rounded-full bg-muted-foreground/55 animate-pulse"
													aria-hidden
												/>
												<span
													className="size-1.5 rounded-full bg-muted-foreground/55 animate-pulse [animation-delay:120ms]"
													aria-hidden
												/>
												<span
													className="size-1.5 rounded-full bg-muted-foreground/55 animate-pulse [animation-delay:240ms]"
													aria-hidden
												/>
											</div>
										) : null}
										<div ref={logEndRef} />
									</div>
								</div>

								<div
									className={cn(
										'relative shrink-0 border-t border-border/50',
										expanded ? 'p-5 md:p-6' : 'p-3'
									)}
								>
									{chatEnded ? (
										<p
											role="status"
											className="rounded-2xl bg-surface-2 px-3.5 py-2.5 text-[12px] leading-relaxed text-muted-foreground"
										>
											Ended by the agent.
										</p>
									) : (
										<form
											className="flex w-full items-center gap-2"
											onSubmit={(event) => {
												event.preventDefault()
												void sendMessage()
											}}
										>
											<label htmlFor={inputId} className="sr-only">
												Message the Eggl agent
											</label>
											<input
												ref={inputRef}
												id={inputId}
												value={draft}
												onChange={(event) => setDraft(event.target.value)}
												placeholder="Ask anything…"
												autoComplete="off"
												disabled={replying}
												className={cn(
													'agent-chat-input min-w-0 flex-1 rounded-full border border-border/70 bg-background/70 text-foreground placeholder:text-muted-foreground disabled:opacity-60',
													expanded
														? 'h-12 px-5 text-[15px]'
														: 'h-10 px-4 text-[13px]'
												)}
											/>
											<button
												type="submit"
												disabled={!draft.trim() || replying}
												aria-label="Send message"
												className={cn(
													'inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity disabled:opacity-40',
													expanded ? 'size-12' : 'size-10'
												)}
											>
												<Send size={15} strokeWidth={1.75} />
											</button>
										</form>
									)}
									<p className="mt-2 px-1 text-[10px] leading-snug text-muted-foreground/80">
										AI can make mistakes.{' '}
										<Link
											href="/legal/privacy"
											className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
											onClick={close}
										>
											Privacy policy
										</Link>{' '}
										applies.
									</p>
								</div>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>

				<button
					ref={launcherRef}
					type="button"
					aria-expanded={open}
					aria-controls={panelId}
					aria-hidden={expanded}
					tabIndex={expanded ? -1 : undefined}
					aria-label={open ? 'Close agent chat' : 'Open agent chat'}
					onClick={() => (open ? close() : openPanel())}
					className={cn(
						'pointer-events-auto inline-flex size-12 items-center justify-center rounded-full shadow-[0_12px_28px_-14px_rgba(14,18,23,0.55)] transition-colors',
						expanded && 'invisible pointer-events-none',
						open
							? 'border border-border/70 bg-card text-foreground hover:bg-surface-2'
							: 'bg-accent text-accent-foreground hover:bg-accent-light'
					)}
				>
					{open ? (
						<X size={18} strokeWidth={1.75} />
					) : (
						<MessageSquare size={18} strokeWidth={1.75} />
					)}
				</button>
			</div>
		</>
	)
}
