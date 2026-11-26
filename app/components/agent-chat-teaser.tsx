'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, Send, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { revealEase } from './reveal'

type ChatLine = {
	id: string
	role: 'agent' | 'user'
	text: string
}

const GREETING: ChatLine = {
	id: 'greeting',
	role: 'agent',
	text: 'Hey — I’m the Eggl agent. Still warming up, but I’ll help you explore projects, posts, and how I build.'
}

const PREVIEW_REPLY =
	'I’m not connected yet — this is just a preview of the chat.'

export default function AgentChatTeaser() {
	const panelId = useId()
	const inputId = useId()
	const [open, setOpen] = useState(false)
	const [showHint, setShowHint] = useState(false)
	const [draft, setDraft] = useState('')
	const [lines, setLines] = useState<ChatLine[]>([GREETING])
	const [replying, setReplying] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const launcherRef = useRef<HTMLButtonElement>(null)
	const logEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const timer = window.setTimeout(() => setShowHint(true), 2200)
		return () => window.clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (!open) return
		const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180)
		return () => window.clearTimeout(focusTimer)
	}, [open])

	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}, [lines, replying, open])

	useEffect(() => {
		if (!open) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false)
				launcherRef.current?.focus()
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open])

	const close = () => {
		setOpen(false)
		setShowHint(false)
		requestAnimationFrame(() => launcherRef.current?.focus())
	}

	const openPanel = () => {
		setOpen(true)
		setShowHint(false)
	}

	const sendTeaser = () => {
		const text = draft.trim()
		if (!text || replying) return

		const userLine: ChatLine = {
			id: `user-${Date.now()}`,
			role: 'user',
			text
		}
		setLines((prev) => [...prev, userLine])
		setDraft('')
		setReplying(true)

		window.setTimeout(() => {
			setLines((prev) => [
				...prev,
				{
					id: `agent-${Date.now()}`,
					role: 'agent',
					text: PREVIEW_REPLY
				}
			])
			setReplying(false)
		}, 700)
	}

	return (
		<div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
			<AnimatePresence>
				{open ? (
					<motion.div
						key="panel"
						id={panelId}
						role="dialog"
						aria-modal="false"
						aria-labelledby={`${panelId}-title`}
						initial={{ opacity: 0, y: 16, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 12, scale: 0.98 }}
						transition={{ duration: 0.28, ease: revealEase }}
						className="pointer-events-auto w-[min(100vw-2.5rem,22rem)] origin-bottom-right"
					>
						<div className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_20px_50px_-28px_rgba(14,18,23,0.45)] backdrop-blur-xl dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]">
							<div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3.5">
								<div className="flex min-w-0 items-center gap-3">
									<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
										<Sparkles size={16} strokeWidth={1.75} aria-hidden />
									</span>
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<p
												id={`${panelId}-title`}
												className="text-[15px] font-medium tracking-tight text-foreground"
											>
												Eggl Agent
											</p>
											<span className="rounded-full bg-accent/12 px-2 py-0.5 text-[11px] font-medium text-accent">
												Preview
											</span>
										</div>
										<p className="mt-0.5 text-[12px] text-muted-foreground">
											Not connected yet
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={close}
									aria-label="Close agent chat"
									className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
								>
									<X size={16} strokeWidth={1.75} />
								</button>
							</div>

							<div className="flex h-64 flex-col gap-3 overflow-y-auto px-4 py-4">
								<div
									role="log"
									aria-live="polite"
									aria-relevant="additions"
									className="flex flex-col gap-2.5"
								>
									{lines.map((line) => (
										<div
											key={line.id}
											className={cn(
												'max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed',
												line.role === 'agent'
													? 'self-start rounded-bl-md bg-surface-2 text-foreground'
													: 'self-end rounded-br-md bg-accent text-accent-foreground'
											)}
										>
											{line.text}
										</div>
									))}
									{replying ? (
										<div
											role="status"
											className="flex self-start items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-3"
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

							<div className="border-t border-border/60 p-3">
								<form
									className="flex w-full items-center gap-2"
									onSubmit={(event) => {
										event.preventDefault()
										sendTeaser()
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
										className="agent-chat-input h-10 min-w-0 flex-1 rounded-full border border-border/70 bg-background/80 px-4 text-[13px] text-foreground placeholder:text-muted-foreground"
									/>
									<button
										type="submit"
										disabled={!draft.trim() || replying}
										aria-label="Send message"
										className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity disabled:opacity-40"
									>
										<Send size={15} strokeWidth={1.75} />
									</button>
								</form>
								<p className="mt-2 px-1 text-[10px] leading-snug text-muted-foreground/80">
									AI can make mistakes.{' '}
									<Link
										href="/legal/privacy"
										className="underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
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

			<div className="pointer-events-auto flex items-end gap-3">
				<AnimatePresence>
					{!open && showHint ? (
						<motion.button
							key="hint"
							type="button"
							initial={{ opacity: 0, x: 8 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 6 }}
							transition={{ duration: 0.25, ease: revealEase }}
							onClick={openPanel}
							className="hidden max-w-[14rem] rounded-2xl border border-border/70 bg-card/90 px-3.5 py-2.5 text-left text-[13px] leading-snug text-foreground shadow-[0_12px_30px_-18px_rgba(14,18,23,0.4)] backdrop-blur-xl sm:block"
						>
							<span className="text-[11px] font-medium text-accent">New</span>
							<span className="mt-0.5 block text-muted-foreground">
								Meet the Eggl agent
							</span>
						</motion.button>
					) : null}
				</AnimatePresence>

				<div className="relative">
					{!open && showHint ? (
						<span
							aria-hidden
							className="pointer-events-none absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent ring-2 ring-background"
						/>
					) : null}
					<button
						ref={launcherRef}
						type="button"
						aria-expanded={open}
						aria-controls={panelId}
						aria-label={open ? 'Close agent chat' : 'Open agent chat'}
						onClick={() => (open ? close() : openPanel())}
						className={cn(
							'inline-flex size-12 items-center justify-center rounded-full shadow-[0_12px_28px_-14px_rgba(14,18,23,0.55)] transition-colors',
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
			</div>
		</div>
	)
}
