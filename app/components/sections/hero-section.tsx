'use client'
import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import useSmoothScroll from '../../hooks/use-smooth-scroll'
import { Button } from '../ui/button'

/** RMS envelope of “Robert Eggl” (macOS Anna TTS), 28 bars */
const NAME_WAVEFORM = [
	23, 24, 18, 18, 27, 38, 44, 42, 41, 41, 38, 25, 16, 13, 14, 42, 44, 38, 38,
	34, 34, 31, 21, 10, 6, 14, 10, 10
] as const

const HeroSection = () => {
	const { handleHashLinkClick } = useSmoothScroll()
	const reduceMotion = useReducedMotion()
	const sectionRef = useRef<HTMLElement>(null)
	const [wavePlaying, setWavePlaying] = useState(false)

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

			<motion.div
				style={{ opacity: heroOpacity }}
				className="container-custom relative z-10 flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--navbar-height,68px)+3.5rem)] md:pb-24 md:pt-[calc(var(--navbar-height,68px)+5rem)]"
			>
				<div className="mx-auto max-w-4xl text-center">
					<motion.div
						aria-hidden="true"
						title="Pronunciation of Robert Eggl"
						onHoverStart={() => {
							if (reduceMotion) return
							setWavePlaying(false)
							requestAnimationFrame(() => setWavePlaying(true))
						}}
						onHoverEnd={() => setWavePlaying(false)}
						className="soft-hero soft-hero-d1 mx-auto mb-5 inline-flex p-2 opacity-45 dark:opacity-55 md:mb-6"
					>
						<svg
							width="224"
							height="48"
							viewBox="0 0 224 48"
							fill="none"
							className="overflow-visible text-foreground"
						>
							{NAME_WAVEFORM.map((h, i) => {
								const baseOpacity = 0.22 + (h / 44) * 0.35
								const peak = Math.min(46, h * 1.35)
								const dip = Math.max(6, h * 0.72)
								return (
									<motion.rect
										key={i}
										x={i * 8}
										width="2"
										rx="0"
										fill="currentColor"
										initial={false}
										animate={
											wavePlaying
												? {
														height: [h, peak, dip, h],
														y: [
															(48 - h) / 2,
															(48 - peak) / 2,
															(48 - dip) / 2,
															(48 - h) / 2
														],
														opacity: [
															baseOpacity,
															Math.min(0.85, baseOpacity + 0.35),
															baseOpacity + 0.1,
															baseOpacity
														]
													}
												: {
														height: h,
														y: (48 - h) / 2,
														opacity: baseOpacity
													}
										}
										transition={
											wavePlaying
												? {
														duration: 0.55,
														delay: i * 0.028,
														ease: [0.22, 1, 0.36, 1]
													}
												: { duration: 0.25, ease: 'easeOut' }
										}
									/>
								)
							})}
						</svg>
					</motion.div>

					<p className="soft-hero soft-hero-d1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						Fullstack · SAP · Open source
					</p>

					<h1 className="soft-hero soft-hero-d2 mt-9 font-display text-[clamp(3.25rem,10vw,7rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground md:mt-14 lg:mt-16">
						Robert Eggl
					</h1>

					<p className="soft-hero soft-hero-d3 mx-auto mt-7 max-w-2xl font-display text-[clamp(1.35rem,3.4vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.03em]">
						<span className="text-foreground">Systems people </span>
						<span className="text-muted-foreground">actually use.</span>
					</p>

					<p className="soft-hero soft-hero-d4 mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px]">
						Building across enterprise software, open source, and applied AI.
						Shipped, maintained, and in production.
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
