'use client'
import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSmoothScroll from '../../hooks/use-smooth-scroll'
import { Button } from '../ui/button'

/** Voice-like mark for “Robert Eggl” — shaped for character, not accuracy */
const NAME_WAVEFORM = [
	8, 14, 22, 19, 28, 41, 46, 37, 44, 39, 31, 18, 11, 9, 15, 36, 45, 40, 47, 33,
	38, 29, 16, 12, 21, 14, 9, 6
] as const

const WAVE_EASE = [0.22, 1, 0.36, 1] as const
const WAVE_INTRO_BASE_DELAY = 0.08
const WAVE_INTRO_STAGGER = 0.03
const WAVE_INTRO_DURATION = 0.65
const WAVE_PLAY_STAGGER = 0.028
const WAVE_PLAY_DURATION = 0.55

const HeroSection = () => {
	const { handleHashLinkClick } = useSmoothScroll()
	const reduceMotion = useReducedMotion()
	const sectionRef = useRef<HTMLElement>(null)
	const [wavePlaying, setWavePlaying] = useState(false)
	const [waveSettled, setWaveSettled] = useState(false)

	useEffect(() => {
		if (reduceMotion) {
			setWaveSettled(true)
			return
		}

		const timers: number[] = []
		const riseEndMs =
			(WAVE_INTRO_BASE_DELAY +
				(NAME_WAVEFORM.length - 1) * WAVE_INTRO_STAGGER +
				WAVE_INTRO_DURATION) *
			1000
		const playEndMs =
			(WAVE_PLAY_DURATION + (NAME_WAVEFORM.length - 1) * WAVE_PLAY_STAGGER) *
			1000

		timers.push(
			window.setTimeout(() => {
				setWavePlaying(true)
				timers.push(
					window.setTimeout(() => {
						setWavePlaying(false)
						setWaveSettled(true)
					}, playEndMs)
				)
			}, riseEndMs)
		)

		return () => {
			for (const id of timers) window.clearTimeout(id)
		}
	}, [reduceMotion])

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
							if (reduceMotion || !waveSettled) return
							setWavePlaying(false)
							requestAnimationFrame(() => setWavePlaying(true))
						}}
						onHoverEnd={() => {
							if (!waveSettled) return
							setWavePlaying(false)
						}}
						className="mx-auto mb-5 inline-flex p-2 opacity-45 dark:opacity-55 md:mb-7 lg:mb-12"
					>
						<svg
							width="224"
							height="48"
							viewBox="0 0 224 48"
							fill="none"
							className="overflow-visible text-foreground"
						>
							{NAME_WAVEFORM.map((h, i) => {
								const baseOpacity = 0.22 + (h / 47) * 0.38
								const peak = Math.min(46, h * 1.32)
								const dip = Math.max(5, h * 0.7)
								const rest = {
									height: h,
									y: (48 - h) / 2,
									opacity: baseOpacity
								}
								return (
									<motion.rect
										key={i}
										x={i * 8}
										width="2"
										rx="0"
										fill="currentColor"
										initial={
											reduceMotion ? rest : { height: 2, y: 23, opacity: 0 }
										}
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
												: rest
										}
										transition={
											wavePlaying
												? {
														duration: WAVE_PLAY_DURATION,
														delay: i * WAVE_PLAY_STAGGER,
														ease: WAVE_EASE
													}
												: waveSettled
													? { duration: 0.25, ease: 'easeOut' }
													: {
															duration: WAVE_INTRO_DURATION,
															delay:
																WAVE_INTRO_BASE_DELAY + i * WAVE_INTRO_STAGGER,
															ease: WAVE_EASE
														}
										}
									/>
								)
							})}
						</svg>
					</motion.div>

					<p className="soft-hero soft-hero-d1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						Fullstack · SAP · Open source
					</p>

					{/* pb keeps g-descenders inside the box while filter:blur paints during soft-hero-in */}
					<h1 className="soft-hero soft-hero-d2 mt-9 -mb-[0.22em] pb-[0.22em] font-display text-[clamp(3.25rem,10vw,7rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground md:mt-14 lg:mt-20 xl:mt-24">
						Robert Eggl
					</h1>

					<p className="soft-hero soft-hero-d3 mx-auto mt-7 max-w-2xl font-display text-[clamp(1.35rem,3.4vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.03em] lg:mt-10">
						<span className="text-foreground">Systems people </span>
						<span className="text-muted-foreground">actually use.</span>
					</p>

					<p className="soft-hero soft-hero-d4 mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] lg:mt-6">
						Building across enterprise software, open source, and applied AI.
						Shipped, maintained, and in production.
					</p>

					<div className="soft-hero soft-hero-d5 mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12 md:gap-4 lg:mt-16 xl:mt-20">
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
