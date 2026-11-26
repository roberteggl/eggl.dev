type Bucket = {
	count: number
	resetAt: number
}

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

export function checkRateLimit(key: string): {
	ok: boolean
	retryAfterSec: number
} {
	const now = Date.now()
	const existing = buckets.get(key)

	if (!existing || existing.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
		return { ok: true, retryAfterSec: 0 }
	}

	if (existing.count >= MAX_REQUESTS) {
		return {
			ok: false,
			retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
		}
	}

	existing.count += 1
	return { ok: true, retryAfterSec: 0 }
}

export function clientIp(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for')
	if (forwarded) {
		const first = forwarded.split(',')[0]?.trim()
		if (first) return first
	}

	const realIp = request.headers.get('x-real-ip')?.trim()
	if (realIp) return realIp

	return 'unknown'
}
