'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

interface SectionHeaderProps {
	number: string
	eyebrow?: string
	title: string
	description?: string
	className?: string
	mbSize?: string
	align?: 'left' | 'center'
	/** Light-on-accent treatment for SignalField panels */
	invert?: boolean
}

const ease = [0.22, 1, 0.36, 1] as const
const cssEase = 'cubic-bezier(0.22, 1, 0.36, 1)'

const SectionHeader = ({
	number,
	eyebrow,
	title,
	description,
	className = '',
	mbSize = 'mb-12 md:mb-16',
	align = 'left',
	invert = false
}: SectionHeaderProps) => {
	const centered = align === 'center'
	const rootRef = useRef<HTMLDivElement>(null)
	const reduceMotion = useReducedMotion()
	const inView = useInView(rootRef, { once: true, amount: 0.4 })
	const revealed = Boolean(reduceMotion || inView)

	const numberColor = invert
		? revealed
			? 'text-accent-foreground/28'
			: 'text-accent-foreground/15'
		: revealed
			? 'text-foreground/22'
			: 'text-foreground/10'

	const fadeUp = {
		hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
		show: (delay: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: reduceMotion ? 0 : 0.6,
				ease,
				delay: reduceMotion ? 0 : delay
			}
		})
	}

	return (
		<div
			ref={rootRef}
			className={`${mbSize} ${centered ? 'text-center' : ''} ${className}`}
		>
			{eyebrow ? (
				<div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
					<motion.span
						custom={0.07}
						initial="hidden"
						animate={revealed ? 'show' : 'hidden'}
						variants={fadeUp}
						className={`inline-block font-mono text-[11px] uppercase tracking-[0.18em] ${
							invert ? 'text-accent-foreground/70' : 'text-muted-foreground'
						}`}
					>
						{eyebrow}
					</motion.span>
				</div>
			) : null}

			<div
				className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6 ${
					centered ? 'sm:justify-center' : ''
				}`}
			>
				<span
					aria-hidden="true"
					style={{
						transitionTimingFunction: cssEase,
						transitionDuration: reduceMotion ? '0ms' : '900ms'
					}}
					className={`select-none font-display text-6xl leading-none tracking-tighter transition-colors md:text-7xl ${numberColor} ${
						centered ? 'sm:text-center' : ''
					}`}
				>
					{number}
				</span>

				<div className={centered ? 'sm:text-left' : ''}>
					<motion.h2
						custom={0.14}
						initial="hidden"
						animate={revealed ? 'show' : 'hidden'}
						variants={fadeUp}
						className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl ${
							invert ? 'text-accent-foreground' : 'text-foreground'
						}`}
					>
						{title}
					</motion.h2>

					{description ? (
						<motion.p
							custom={0.21}
							initial="hidden"
							animate={revealed ? 'show' : 'hidden'}
							variants={fadeUp}
							className={`mt-4 max-w-2xl text-lg leading-relaxed ${
								centered ? 'mx-auto sm:mx-0' : ''
							} ${
								invert ? 'text-accent-foreground/75' : 'text-muted-foreground'
							}`}
						>
							{description}
						</motion.p>
					) : null}
				</div>
			</div>
		</div>
	)
}

export default SectionHeader
