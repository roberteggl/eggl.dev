import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, clientIp } from '@/lib/agent/rate-limit'
import { createAgentEventStream } from '@/lib/agent/stream'

export const runtime = 'nodejs'
export const maxDuration = 60

const messageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	content: z.string().trim().min(1).max(2000)
})

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1).max(12)
})

export async function POST(request: Request) {
	if (!process.env.OPENAI_API_KEY) {
		return NextResponse.json(
			{ error: 'Chat is not configured' },
			{ status: 503 }
		)
	}

	const ip = clientIp(request)
	const limit = checkRateLimit(ip)
	if (!limit.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Try again shortly.' },
			{
				status: 429,
				headers: { 'Retry-After': String(limit.retryAfterSec) }
			}
		)
	}

	let json: unknown
	try {
		json = await request.json()
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const parsed = bodySchema.safeParse(json)
	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Invalid messages payload' },
			{ status: 400 }
		)
	}

	const stream = createAgentEventStream(parsed.data.messages)

	return new Response(stream, {
		headers: {
			'Content-Type': 'application/x-ndjson; charset=utf-8',
			'Cache-Control': 'no-cache, no-transform',
			'X-Content-Type-Options': 'nosniff'
		}
	})
}
