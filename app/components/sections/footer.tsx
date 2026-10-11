import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import { PERSON_TAGLINE } from '@/lib/structured-data'

const Footer = () => {
	const currentYear = new Date().getFullYear()
	const gitSha = process.env.NEXT_PUBLIC_GIT_SHA ?? 'development'

	return (
		<footer className="relative z-10 border-t border-line bg-surface/50">
			<div className="container-custom py-14 md:py-20">
				<div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
					<div>
						<p className="font-display text-3xl tracking-tight text-foreground">
							Robert Eggl
						</p>
						<p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
							{PERSON_TAGLINE}
						</p>
						<div className="mt-6 flex gap-2">
							<a
								href="https://github.com/roberteggl"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-none border border-line p-2.5 text-foreground/70 transition-colors duration-200 hover:border-accent hover:text-accent"
								aria-label="GitHub"
							>
								<Github size={18} strokeWidth={1.75} />
							</a>
							<a
								href="https://linkedin.com/in/roberteggl"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-none border border-line p-2.5 text-foreground/70 transition-colors duration-200 hover:border-accent hover:text-accent"
								aria-label="LinkedIn"
							>
								<Linkedin size={18} strokeWidth={1.75} />
							</a>
							<a
								href="mailto:info@eggl.dev"
								className="rounded-none border border-line p-2.5 text-foreground/70 transition-colors duration-200 hover:border-accent hover:text-accent"
								aria-label="Email"
							>
								<Mail size={18} strokeWidth={1.75} />
							</a>
						</div>
					</div>

					<nav aria-label="Index">
						<p className="eyebrow mb-5">Index</p>
						<ul className="space-y-3 text-[15px]">
							{[
								{ label: 'Projects', href: '/projects' },
								{ label: 'Blog', href: '/blog' },
								{ label: 'GPG Keys', href: '/keys' },
								{ label: 'Contact', href: '/#contact' }
							].map((l) => (
								<li key={l.label}>
									<Link
										href={l.href}
										className="group inline-flex items-center gap-1 text-foreground/75 transition-colors hover:text-accent"
									>
										{l.label}
										<ArrowUpRight
											size={14}
											className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
										/>
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label="Elsewhere">
						<p className="eyebrow mb-5">Elsewhere</p>
						<ul className="space-y-3 text-[15px]">
							{[
								{ label: 'GitHub', href: 'https://github.com/roberteggl' },
								{
									label: 'LinkedIn',
									href: 'https://linkedin.com/in/roberteggl'
								},
								{ label: 'Email', href: 'mailto:info@eggl.dev' },
								{ label: 'RSS Feed', href: '/api/feed' }
							].map((l) => (
								<li key={l.label}>
									<a
										href={l.href}
										target={l.href.startsWith('http') ? '_blank' : undefined}
										rel={
											l.href.startsWith('http')
												? 'noopener noreferrer'
												: undefined
										}
										className="group inline-flex items-center gap-1 text-foreground/75 transition-colors hover:text-accent"
									>
										{l.label}
										<ArrowUpRight
											size={14}
											className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
										/>
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 text-[13px] text-muted-foreground md:flex-row md:items-center">
					<p>© {currentYear} Robert Eggl. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link
							href="/legal/imprint"
							className="transition-colors hover:text-accent"
						>
							Imprint
						</Link>
						<Link
							href="/legal/privacy"
							className="transition-colors hover:text-accent"
						>
							Privacy
						</Link>
						<a
							href={`https://github.com/roberteggl/eggl.dev/commit/${gitSha}`}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden font-mono text-xs text-muted-foreground transition-colors hover:text-accent sm:inline"
							aria-label="View commit on GitHub"
						>
							{gitSha.slice(0, 7)}
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
