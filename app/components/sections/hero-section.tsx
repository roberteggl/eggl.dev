'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import useSmoothScroll from '../../hooks/use-smooth-scroll'
import { Button } from '../ui/button'

const LANES = [
	{
		index: '01',
		label: 'Enterprise',
		line: 'Fullstack & process consulting at SAP.'
	},
	{
		index: '02',
		label: 'Open Source',
		line: 'Campus apps and tools used by thousands.'
	},
	{
		index: '03',
		label: 'AI Agents',
		line: 'Applied AI and agentic systems in production.'
	}
] as const

const HeroSection = () => {
	const { handleHashLinkClick } = useSmoothScroll()

	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(15,118,110,0.1),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(14,18,23,0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(45,212,191,0.08),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(45,212,191,0.03),transparent_50%)]"
			/>

			<div
				className="container-custom relative z-10 pb-14 md:pb-24"
				style={{ paddingTop: 'calc(var(--navbar-height, 68px) + 2.5rem)' }}
			>
				<p className="mb-4 flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
					<span
						aria-hidden="true"
						className="inline-block size-1.5 bg-accent"
					/>
					Fullstack Developer · Germany
				</p>

				<h1 className="font-display text-[clamp(2.85rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground">
					Robert Eggl
				</h1>

				<p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
					Building across enterprise software, open source, and AI, for systems
					people actually use.
				</p>

				<ul className="mt-10 grid border-y border-line md:grid-cols-3">
					{LANES.map((lane, i) => (
						<li
							key={lane.label}
							className={`py-5 md:px-6 md:py-6 ${
								i > 0 ? 'border-t border-line md:border-t-0 md:border-l' : ''
							} ${i === 0 ? 'md:pl-0' : ''} ${i === LANES.length - 1 ? 'md:pr-0' : ''}`}
						>
							<p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
								<span aria-hidden="true">{lane.index}</span>
								{lane.label}
							</p>
							<p className="mt-2.5 text-[15px] leading-snug text-foreground/85 md:text-base">
								{lane.line}
							</p>
						</li>
					))}
				</ul>

				<div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4">
					<Button
						type="button"
						size="lg"
						onClick={(e) => handleHashLinkClick(e, 'projects')}
						className="cursor-pointer"
					>
						View selected projects
						<ArrowRight size={17} />
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/blog">Read the blog</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}

export default HeroSection
