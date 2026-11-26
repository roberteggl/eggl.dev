'use client'

import { useEffect, useState } from 'react'
import useSmoothScroll from '../hooks/use-smooth-scroll'

const SECTIONS = [
	{ id: 'projects', number: '01', label: 'Work' },
	{ id: 'about', number: '02', label: 'About' },
	{ id: 'experience', number: '03', label: 'Journey' },
	{ id: 'activity', number: '04', label: 'Proof' },
	{ id: 'contact', number: '05', label: 'Contact' }
] as const

type SectionId = (typeof SECTIONS)[number]['id']

const SectionIndex = () => {
	const { handleHashLinkClick } = useSmoothScroll()
	const [active, setActive] = useState<SectionId | null>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const sync = () => {
			const marker = window.innerHeight * 0.32
			const projects = document.getElementById('projects')
			if (!projects) return

			const pastHero = projects.getBoundingClientRect().top <= marker + 80
			setVisible(pastHero)

			if (!pastHero) {
				setActive(null)
				return
			}

			let current: SectionId = SECTIONS[0].id
			for (const section of SECTIONS) {
				const el = document.getElementById(section.id)
				if (!el) continue
				if (el.getBoundingClientRect().top <= marker) {
					current = section.id
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
	}, [])

	return (
		<nav
			aria-label="Page sections"
			aria-hidden={!visible}
			className={`pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 xl:block 2xl:left-8 ${
				visible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<ul className="flex flex-col gap-1">
				{SECTIONS.map((section) => {
					const isActive = active === section.id
					return (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								onClick={(e) => handleHashLinkClick(e, section.id)}
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
									{section.number}
								</span>
								<span
									className={`overflow-hidden font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
										isActive
											? 'max-w-[5.5rem] opacity-100'
											: 'max-w-0 opacity-0 group-hover:max-w-[5.5rem] group-hover:opacity-70'
									}`}
								>
									{section.label}
								</span>
							</a>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default SectionIndex
