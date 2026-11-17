'use client'

interface TickerProps {
	items: string[]
	className?: string
	speedSeconds?: number
}

/** Quiet proof strip: mono uppercase, CSS marquee. */
export default function Ticker({
	items,
	className = '',
	speedSeconds = 42
}: TickerProps) {
	return (
		<div
			className={`relative overflow-hidden border-y border-line bg-background-dark/40 py-3.5 dark:bg-black/40 ${className}`}
		>
			<div
				className="flex w-max items-center motion-reduce:[animation:none]"
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
								className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
							>
								<span className="mx-5 text-accent/70" aria-hidden="true">
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
