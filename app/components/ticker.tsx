'use client'

interface TickerProps {
	items: string[]
	className?: string
	speedSeconds?: number
}

/** Signal ticker band. Mono uppercase, CSS animation, pauses on hover. */
export default function Ticker({
	items,
	className = '',
	speedSeconds = 42
}: TickerProps) {
	return (
		<div
			className={`group relative overflow-hidden border-y border-foreground/15 bg-surface-2 py-4 ${className}`}
		>
			<div
				className="flex w-max items-center motion-reduce:[animation:none] group-hover:[animation-play-state:paused]"
				style={{ animation: `ticker ${speedSeconds}s linear infinite` }}
			>
				{[0, 1].map((half) => (
					<div
						key={half}
						className="flex w-max shrink-0 items-center"
						aria-hidden={half === 1}
					>
						{items.map((item, i) => (
							<span
								key={`${half}-${i}`}
								className="flex items-center whitespace-nowrap font-mono text-xs uppercase tracking-[0.22em] text-foreground/70"
							>
								<span className="mx-5 text-accent" aria-hidden="true">
									◈
								</span>
								{item}
							</span>
						))}
					</div>
				))}
			</div>
		</div>
	)
}
