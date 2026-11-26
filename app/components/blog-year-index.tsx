'use client'

import { useEffect, useState } from 'react'
import useSmoothScroll from '../hooks/use-smooth-scroll'

export type YearOption = {
	year: number
	count: number
}

type BlogYearIndexProps = {
	years: YearOption[]
}

const BlogYearIndex = ({ years }: BlogYearIndexProps) => {
	const { handleHashLinkClick } = useSmoothScroll()
	const [active, setActive] = useState<number | null>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (years.length === 0) return

		const sync = () => {
			const marker = window.innerHeight * 0.32
			const first = document.getElementById(`year-${years[0].year}`)
			if (!first) return

			const pastHero = first.getBoundingClientRect().top <= marker + 80
			setVisible(pastHero)

			if (!pastHero) {
				setActive(null)
				return
			}

			let current = years[0].year
			for (const { year } of years) {
				const el = document.getElementById(`year-${year}`)
				if (!el) continue
				if (el.getBoundingClientRect().top <= marker) {
					current = year
				}
			}
			setActive(current)
		}

		sync()
		window.addEventListener('scroll', sync, { passive: true })
		window.addEventListener('resize', sync)
		return () => {
			window.removeEventListener('scroll', sync)
			window.removeEventListener('resize', sync)
		}
	}, [years])

	if (years.length === 0) return null

	return (
		<nav
			aria-label="Posts by year"
			aria-hidden={!visible}
			className={`pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 xl:block 2xl:left-8 ${
				visible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<ul className="flex flex-col gap-1">
				{years.map(({ year, count }) => {
					const isActive = active === year
					const id = `year-${year}`
					return (
						<li key={year}>
							<a
								href={`#${id}`}
								onClick={(e) => handleHashLinkClick(e, id)}
								aria-current={isActive ? 'location' : undefined}
								tabIndex={visible ? 0 : -1}
								className={`pointer-events-auto group relative flex items-center gap-3 py-1.5 pl-3 transition-colors duration-200 ${
									isActive
										? 'text-accent'
										: 'text-muted-foreground/55 hover:text-foreground'
								}`}
							>
								<span
									aria-hidden="true"
									className={`absolute bottom-1.5 left-0 top-1.5 w-px origin-center bg-accent transition-transform duration-300 ${
										isActive
											? 'scale-y-100'
											: 'scale-y-0 group-hover:scale-y-50'
									}`}
								/>
								<span className="font-mono text-[11px] tracking-[0.16em]">
									{year}
								</span>
								<span
									className={`overflow-hidden font-mono text-[10px] tracking-[0.14em] transition-all duration-300 ${
										isActive
											? 'max-w-[3rem] opacity-50'
											: 'max-w-0 opacity-0 group-hover:max-w-[3rem] group-hover:opacity-40'
									}`}
								>
									{String(count).padStart(2, '0')}
								</span>
							</a>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default BlogYearIndex
