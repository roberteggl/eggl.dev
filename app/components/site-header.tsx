'use client'
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './theme-toggle'

const NAV_LINKS = [
	{ name: 'Projects', href: '/projects', isPage: true },
	{ name: 'Blog', href: '/blog', isPage: true },
	{ name: 'Keys', href: '/keys', isPage: true },
	{ name: 'Contact', href: '/#contact', isPage: false }
]

const SOCIALS = [
	{ icon: Github, href: 'https://github.com/roberteggl', label: 'GitHub' },
	{
		icon: Linkedin,
		href: 'https://linkedin.com/in/roberteggl',
		label: 'LinkedIn'
	},
	{ icon: Mail, href: 'mailto:info@eggl.dev', label: 'Email' }
]

function isLinkActive(
	link: (typeof NAV_LINKS)[number],
	pathname: string,
	hash: string
) {
	if (!link.isPage) {
		return pathname === '/' && hash === '#contact'
	}
	return pathname === link.href || pathname.startsWith(`${link.href}/`)
}

export default function SiteHeader() {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [progress, setProgress] = useState(0)
	const [hash, setHash] = useState('')

	useEffect(() => {
		const syncHash = () => setHash(window.location.hash)
		syncHash()
		window.addEventListener('hashchange', syncHash)
		return () => window.removeEventListener('hashchange', syncHash)
	}, [])

	useEffect(() => {
		setHash(typeof window !== 'undefined' ? window.location.hash : '')
	}, [pathname])

	useEffect(() => {
		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight
			setScrolled(window.scrollY > 12)
			setProgress(max > 0 ? window.scrollY / max : 0)
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	useEffect(() => {
		const setHeight = () => {
			const el = document.getElementById('site-header')
			if (el) {
				document.documentElement.style.setProperty(
					'--navbar-height',
					`${el.getBoundingClientRect().height}px`
				)
			}
		}
		setHeight()
		window.addEventListener('resize', setHeight)
		return () => window.removeEventListener('resize', setHeight)
	}, [isMenuOpen])

	const desktopLinkClass = (active: boolean) =>
		`relative pb-1 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors duration-150 hover:text-accent ${
			active ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'
		}`

	const hairlineClass = (active: boolean) =>
		`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
			active ? 'scale-x-100' : 'scale-x-0'
		}`

	const mobileLinkClass = (active: boolean) =>
		`flex items-center justify-between border-b border-black/10 py-3.5 font-display text-2xl transition-colors duration-150 last:border-0 hover:text-accent dark:border-white/15 ${
			active ? 'text-accent' : 'text-black dark:text-white'
		}`

	return (
		<header
			id="site-header"
			className={`fixed inset-x-0 top-0 z-50 border-b bg-white text-black dark:bg-black dark:text-white ${
				scrolled
					? 'border-black/15 dark:border-white/20'
					: 'border-black/10 dark:border-white/15'
			}`}
		>
			<div className="container-custom flex h-[68px] items-center justify-between">
				<Link
					href="/"
					className="group flex items-baseline gap-2.5"
					aria-label="Robert Eggl, home page"
				>
					<span className="font-display text-[22px] font-medium leading-none tracking-tight text-black dark:text-white">
						Robert Eggl
					</span>
					<span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 transition-colors group-hover:text-accent dark:text-white/45 sm:inline">
						eggl.dev
					</span>
				</Link>

				<nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
					{NAV_LINKS.map((link) => {
						const active = isLinkActive(link, pathname, hash)
						const className = desktopLinkClass(active)

						return link.isPage ? (
							<Link
								key={link.name}
								href={link.href}
								aria-current={active ? 'page' : undefined}
								className={className}
							>
								{link.name}
								<span aria-hidden="true" className={hairlineClass(active)} />
							</Link>
						) : (
							<a
								key={link.name}
								href={link.href}
								aria-current={active ? 'page' : undefined}
								className={className}
							>
								{link.name}
								<span aria-hidden="true" className={hairlineClass(active)} />
							</a>
						)
					})}

					<span
						aria-hidden="true"
						className="h-4 w-px bg-black/15 dark:bg-white/20"
					/>

					<div className="flex items-center gap-1">
						{SOCIALS.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target={s.href.startsWith('http') ? '_blank' : undefined}
								rel={
									s.href.startsWith('http') ? 'noopener noreferrer' : undefined
								}
								aria-label={s.label}
								className="rounded-none p-2 text-black/70 transition-colors duration-150 hover:bg-black/5 hover:text-accent dark:text-white/70 dark:hover:bg-white/10"
							>
								<s.icon size={17} strokeWidth={1.75} />
							</a>
						))}
					</div>

					<ThemeToggle />
				</nav>

				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => setIsMenuOpen((v) => !v)}
						className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-black/20 text-black transition-colors duration-150 hover:border-accent hover:text-accent dark:border-white/25 dark:text-white"
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={isMenuOpen}
					>
						{isMenuOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="h-[2px] origin-left bg-accent"
				style={{ transform: `scaleX(${progress})` }}
			/>

			{isMenuOpen ? (
				<div className="border-b border-black/10 bg-white md:hidden dark:border-white/15 dark:bg-black">
					<nav
						className="container-custom flex flex-col gap-1 py-5"
						aria-label="Mobile"
					>
						{NAV_LINKS.map((link, i) => {
							const active = isLinkActive(link, pathname, hash)
							const className = mobileLinkClass(active)

							return link.isPage ? (
								<Link
									key={link.name}
									href={link.href}
									onClick={() => setIsMenuOpen(false)}
									aria-current={active ? 'page' : undefined}
									className={className}
								>
									{link.name}
									<span className="font-mono text-[11px] text-black/40 dark:text-white/40">
										0{i + 1}
									</span>
								</Link>
							) : (
								<a
									key={link.name}
									href={link.href}
									onClick={() => setIsMenuOpen(false)}
									aria-current={active ? 'page' : undefined}
									className={className}
								>
									{link.name}
									<span className="font-mono text-[11px] text-black/40 dark:text-white/40">
										0{i + 1}
									</span>
								</a>
							)
						})}
						<div className="flex items-center gap-2 pt-3">
							{SOCIALS.map((s) => (
								<a
									key={s.label}
									href={s.href}
									target={s.href.startsWith('http') ? '_blank' : undefined}
									rel={
										s.href.startsWith('http')
											? 'noopener noreferrer'
											: undefined
									}
									aria-label={s.label}
									className="rounded-none border border-black/20 p-3 text-black/70 transition-colors duration-150 hover:border-accent hover:text-accent dark:border-white/25 dark:text-white/70"
								>
									<s.icon size={18} strokeWidth={1.75} />
								</a>
							))}
						</div>
					</nav>
				</div>
			) : null}
		</header>
	)
}
