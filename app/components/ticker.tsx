'use client'

import { useEffect, useRef, useState } from 'react'

interface TickerProps {
	items: string[]
	className?: string
	speedSeconds?: number
}

function TickerSegment({
	items,
	copies,
	hidden
}: {
	items: string[]
	copies: number
	hidden?: boolean
}) {
	return (
		<div
			className="flex w-max shrink-0 items-center"
			aria-hidden={hidden || undefined}
		>
			{Array.from({ length: copies }, (_, copy) =>
				items.map((item, i) => (
					<span
						key={`${copy}-${i}`}
						className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
					>
						<span className="mx-5 text-accent/70" aria-hidden="true">
							◈
						</span>
						{item}
					</span>
				))
			)}
		</div>
	)
}

/** Quiet proof strip: mono uppercase, CSS marquee. */
export default function Ticker({
	items,
	className = '',
	speedSeconds = 42
}: TickerProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const measureRef = useRef<HTMLDivElement>(null)
	const [copies, setCopies] = useState(1)

	useEffect(() => {
		const update = () => {
			const setWidth = measureRef.current?.scrollWidth ?? 0
			const viewWidth = containerRef.current?.clientWidth ?? 0
			if (!setWidth || !viewWidth) return
			// One animated half must cover the viewport or the loop shows a gap.
			setCopies(Math.max(1, Math.ceil(viewWidth / setWidth) + 1))
		}

		update()
		const ro = new ResizeObserver(update)
		if (containerRef.current) ro.observe(containerRef.current)
		if (measureRef.current) ro.observe(measureRef.current)
		return () => ro.disconnect()
	}, [items])

	return (
		<div
			ref={containerRef}
			className={`relative overflow-hidden border-y border-line bg-background-dark/40 py-3.5 dark:bg-black/40 ${className}`}
		>
			{/* Offscreen single pass used only to measure base set width */}
			<div
				ref={measureRef}
				className="pointer-events-none absolute left-0 top-0 -z-10 flex w-max opacity-0"
				aria-hidden="true"
			>
				<TickerSegment items={items} copies={1} hidden />
			</div>

			<div
				className="flex w-max items-center motion-reduce:[animation:none]"
				style={{
					animation: `ticker ${speedSeconds * copies}s linear infinite`
				}}
			>
				<TickerSegment items={items} copies={copies} />
				<TickerSegment items={items} copies={copies} hidden />
			</div>
		</div>
	)
}
