'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { SITE_URL } from '@/lib/structured-data'
import { cn } from '@/lib/utils'

const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')

const LINK_CLASS =
	'font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent'

function toInternalHref(raw: string): string | null {
	const trimmed = raw.trim()
	if (!trimmed) return null

	if (trimmed.startsWith('/')) {
		return trimmed
	}

	if (trimmed === SITE_ORIGIN || trimmed.startsWith(`${SITE_ORIGIN}/`)) {
		return trimmed.slice(SITE_ORIGIN.length) || '/'
	}

	// Dev / absolute site URLs the model sometimes emits
	try {
		if (/^https?:\/\//i.test(trimmed)) {
			const url = new URL(trimmed)
			const host = url.hostname.toLowerCase()
			if (
				host === 'eggl.dev' ||
				host === 'www.eggl.dev' ||
				host === 'localhost' ||
				host === '127.0.0.1'
			) {
				return url.pathname || '/'
			}
		}
	} catch {
		return null
	}

	return null
}

function isSafeHref(href: string): boolean {
	const value = href.trim().toLowerCase()
	return (
		value.startsWith('/') ||
		value.startsWith('https://') ||
		value.startsWith('http://') ||
		value.startsWith('mailto:')
	)
}

export default function AgentMessageContent({
	text,
	className,
	onNavigate
}: {
	text: string
	className?: string
	onNavigate?: () => void
}) {
	const router = useRouter()

	const components: Components = {
		p: ({ children }) => (
			<p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>
		),
		strong: ({ children }) => (
			<strong className="font-semibold text-foreground">{children}</strong>
		),
		em: ({ children }) => <em className="italic">{children}</em>,
		a: ({ href, children }) => {
			if (!href || !isSafeHref(href)) {
				return <span>{children}</span>
			}

			const internal = toInternalHref(href)
			if (internal) {
				return (
					<Link
						href={internal}
						className={LINK_CLASS}
						onClick={(event) => {
							// Close unmounts the panel — push first so navigation isn't cancelled.
							event.preventDefault()
							router.push(internal)
							onNavigate?.()
						}}
					>
						{children}
					</Link>
				)
			}

			return (
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className={LINK_CLASS}
				>
					{children}
				</a>
			)
		},
		ul: ({ children }) => (
			<ul className="mb-2 list-disc space-y-0.5 pl-4 last:mb-0">{children}</ul>
		),
		ol: ({ children }) => (
			<ol className="mb-2 list-decimal space-y-0.5 pl-4 last:mb-0">
				{children}
			</ol>
		),
		li: ({ children }) => <li className="leading-relaxed">{children}</li>,
		code: ({ children }) => (
			<code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[12px]">
				{children}
			</code>
		)
	}

	return (
		<div className={cn('agent-md', className)}>
			<ReactMarkdown components={components}>{text}</ReactMarkdown>
		</div>
	)
}
