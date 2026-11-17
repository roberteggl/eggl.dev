'use client'
import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import useSmoothScroll from '../../hooks/use-smooth-scroll'
import { Button } from '../ui/button'

const PROOF = [
	{ value: '4k+', label: 'Campus users' },
	{ value: 'SAP', label: 'Enterprise delivery' },
	{ value: 'OSS', label: 'Shipped in production' }
] as const

const HeroSection = () => {
	const { handleHashLinkClick } = useSmoothScroll()
	const reduceMotion = useReducedMotion()
	const sectionRef = useRef<HTMLElement>(null)

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start start', 'end start']
	})

	const heroOpacity = useTransform(
		scrollYProgress,
		[0, 0.55],
		[1, reduceMotion ? 1 : 0.2]
	)
	const bloomOpacity = useTransform(
		scrollYProgress,
		[0, 0.5],
		[1, reduceMotion ? 1 : 0]
	)

	return (
		<section
			ref={sectionRef}
			className="hero-section relative flex min-h-[100svh] flex-col overflow-hidden"
		>
			<motion.div
				aria-hidden="true"
				style={{ opacity: bloomOpacity }}
				className="pointer-events-none absolute inset-0"
			>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_20%,rgba(45,212,191,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_18%,rgba(45,212,191,0.1),transparent_58%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(14,18,23,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_45%_35%_at_85%_75%,rgba(45,212,191,0.04),transparent_55%)]" />
			</motion.div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center opacity-40 dark:opacity-50"
			>
				<svg
					width="220"
					height="48"
					viewBox="0 0 220 48"
					fill="none"
					className="text-foreground"
				>
					{Array.from({ length: 28 }).map((_, i) => {
						const h = 8 + ((i * 17) % 28) + (i % 3) * 4
						return (
							<rect
								key={i}
								x={i * 8}
								y={(48 - h) / 2}
								width="2"
								height={h}
								rx="0"
								fill="currentColor"
								opacity={0.25 + (i % 5) * 0.08}
							/>
						)
					})}
				</svg>
			</div>

			<motion.div
				style={{ opacity: heroOpacity }}
				className="container-custom relative z-10 flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--navbar-height,68px)+3.5rem)] md:pb-24 md:pt-[calc(var(--navbar-height,68px)+5rem)]"
			>
				<div className="mx-auto max-w-4xl text-center">
					<p className="soft-hero soft-hero-d1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						Fullstack · SAP · Open source
					</p>

					<h1 className="soft-hero soft-hero-d2 mt-6 font-display text-[clamp(3.25rem,10vw,7rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground">
						Robert Eggl
					</h1>

					<p className="soft-hero soft-hero-d3 mx-auto mt-7 max-w-2xl font-display text-[clamp(1.35rem,3.4vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.03em]">
						<span className="text-foreground">Systems people </span>
						<span className="text-muted-foreground">actually use.</span>
					</p>

					<p className="soft-hero soft-hero-d4 mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px]">
						Building across enterprise software, open source, and applied AI —
						shipped, maintained, and in production.
					</p>

					<div className="soft-hero soft-hero-d5 mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12 md:gap-4">
						<Button
							type="button"
							size="lg"
							onClick={(e) => handleHashLinkClick(e, 'projects')}
							className="group cursor-pointer"
						>
							View selected work
							<ArrowRight
								size={17}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/blog">Read the blog</Link>
						</Button>
					</div>
				</div>

				<ul className="soft-hero soft-hero-d5 mx-auto mt-16 grid w-full max-w-3xl grid-cols-3 gap-px border border-line bg-line md:mt-20">
					{PROOF.map((item) => (
						<li
							key={item.label}
							className="bg-background px-3 py-5 text-center md:px-6 md:py-7"
						>
							<p className="font-display text-xl tracking-tight text-foreground md:text-2xl">
								{item.value}
							</p>
							<p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]">
								{item.label}
							</p>
						</li>
					))}
				</ul>
			</motion.div>

			{!reduceMotion ? (
				<motion.div
					aria-hidden="true"
					style={{ opacity: bloomOpacity }}
					className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
				>
					<div className="soft-hero soft-hero-d5 flex flex-col items-center gap-2 opacity-45">
						<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
							Scroll
						</span>
						<span className="h-8 w-px origin-top bg-foreground/30" />
					</div>
				</motion.div>
			) : null}
		</section>
	)
}

export default HeroSection
