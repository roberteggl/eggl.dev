import type { ReactNode } from 'react'

interface PageHeroProps {
	eyebrow?: string
	title: string
	description?: string
	/** Optional right-side action (RSS, view toggle, etc.) */
	action?: ReactNode
	className?: string
}

/** Shared inner-page header — dark premium, no enter animation. */
export default function PageHero({
	eyebrow,
	title,
	description,
	action,
	className = ''
}: PageHeroProps) {
	return (
		<header
			className={`mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10 md:mb-14 ${className}`}
		>
			<div className="max-w-2xl">
				{eyebrow ? (
					<p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						{eyebrow}
					</p>
				) : null}
				<h1 className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground">
					{title}
				</h1>
				{description ? (
					<p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
						{description}
					</p>
				) : null}
			</div>
			{action ? <div className="shrink-0 pb-1">{action}</div> : null}
		</header>
	)
}
