'use client'
import { motion, useReducedMotion } from 'framer-motion'
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

const ease = [0.22, 1, 0.36, 1] as const

const HeroSection = () => {
	const { handleHashLinkClick } = useSmoothScroll()
	const reduceMotion = useReducedMotion()

	const fadeUp = {
		hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduceMotion ? 0 : 0.75, ease }
		}
	}

	const titleReveal = {
		hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduceMotion ? 0 : 0.9, ease }
		}
	}

	const drawLine = {
		hidden: reduceMotion ? { scaleX: 1 } : { scaleX: 0 },
		show: {
			scaleX: 1,
			transition: { duration: reduceMotion ? 0 : 0.85, ease }
		}
	}

	const laneItem = {
		hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: reduceMotion ? 0 : 0.55, ease }
		}
	}

	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(15,118,110,0.1),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(14,18,23,0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(45,212,191,0.08),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(45,212,191,0.03),transparent_50%)]"
			/>
			{!reduceMotion ? (
				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute -left-1/4 top-0 size-[55vmax] rounded-full bg-accent/[0.06] blur-3xl dark:bg-accent/[0.05]"
					animate={{
						x: [0, 40, 0],
						y: [0, 28, 0],
						scale: [1, 1.08, 1]
					}}
					transition={{
						duration: 18,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'easeInOut'
					}}
				/>
			) : null}

			<motion.div
				className="container-custom relative z-10 pb-14 pt-[calc(var(--navbar-height,68px)+4.5rem)] md:pb-36 md:pt-[calc(var(--navbar-height,68px)+6rem)]"
				initial="hidden"
				animate="show"
				variants={{
					hidden: {},
					show: {
						transition: {
							staggerChildren: reduceMotion ? 0 : 0.14,
							delayChildren: reduceMotion ? 0 : 0.06
						}
					}
				}}
			>
				<motion.h1
					variants={titleReveal}
					className="font-display text-[clamp(2.85rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground"
				>
					Robert Eggl
				</motion.h1>

				<motion.p
					variants={fadeUp}
					className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
				>
					Building across enterprise software, open source, and AI, for systems
					people actually use.
				</motion.p>

				<motion.div
					variants={{
						hidden: {},
						show: {
							transition: {
								staggerChildren: reduceMotion ? 0 : 0.1,
								delayChildren: reduceMotion ? 0 : 0.05
							}
						}
					}}
					className="mt-10"
				>
					<motion.div
						aria-hidden="true"
						className="h-px origin-left bg-line"
						variants={drawLine}
					/>
					<motion.ul
						className="grid md:grid-cols-3"
						variants={{
							hidden: {},
							show: {
								transition: {
									staggerChildren: reduceMotion ? 0 : 0.1
								}
							}
						}}
					>
						{LANES.map((lane, i) => (
							<motion.li
								key={lane.label}
								variants={laneItem}
								className={`group py-5 transition-colors duration-300 md:px-8 md:py-8 ${
									i > 0 ? 'border-t border-line md:border-t-0 md:border-l' : ''
								}`}
							>
								<p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
									<span
										aria-hidden="true"
										className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
									>
										{lane.index}
									</span>
									{lane.label}
								</p>
								<p className="mt-2.5 text-[15px] leading-snug text-foreground/85 transition-colors duration-300 group-hover:text-foreground md:text-base">
									{lane.line}
								</p>
							</motion.li>
						))}
					</motion.ul>
					<motion.div
						aria-hidden="true"
						className="h-px origin-left bg-line"
						variants={drawLine}
					/>
				</motion.div>

				<motion.div
					variants={fadeUp}
					className="mt-12 flex flex-wrap items-center gap-3 md:mt-14 md:gap-4"
				>
					<Button
						type="button"
						size="lg"
						onClick={(e) => handleHashLinkClick(e, 'projects')}
						className="group cursor-pointer"
					>
						View selected projects
						<ArrowRight
							size={17}
							className="transition-transform duration-300 group-hover:translate-x-1"
						/>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/blog">Read the blog</Link>
					</Button>
				</motion.div>
			</motion.div>
		</section>
	)
}

export default HeroSection
