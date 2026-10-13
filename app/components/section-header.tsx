'use client'

import { motion, useReducedMotion } from 'framer-motion'

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
	const reduceMotion = useReducedMotion()

	const fadeUp = {
		hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
		show: (delay: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: reduceMotion ? 0 : 0.85,
				ease,
				delay: reduceMotion ? 0 : delay
			}
		})
	}

	const numberReveal = {
		hidden: reduceMotion
			? { opacity: invert ? 0.28 : 0.22, y: 0 }
			: { opacity: invert ? 0.12 : 0.08, y: 12 },
		show: {
			opacity: invert ? 0.28 : 0.22,
			y: 0,
			transition: {
				duration: reduceMotion ? 0 : 1.05,
				ease,
				delay: reduceMotion ? 0 : 0.04
			}
		}
	}

	return (
		<motion.div
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.25 }}
			className={`${mbSize} ${centered ? 'text-center' : ''} ${className}`}
		>
			{eyebrow ? (
				<div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
					<motion.span
						custom={0}
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
				<motion.span
					aria-hidden="true"
					variants={numberReveal}
					className={`select-none font-display text-6xl leading-none tracking-tighter md:text-7xl ${
						invert ? 'text-accent-foreground' : 'text-foreground'
					} ${centered ? 'sm:text-center' : ''}`}
				>
					{number}
				</motion.span>

				<div className={centered ? 'sm:text-left' : ''}>
					<motion.h2
						custom={eyebrow ? 0.1 : 0.05}
						variants={fadeUp}
						className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl ${
							invert ? 'text-accent-foreground' : 'text-foreground'
						}`}
					>
						{title}
					</motion.h2>

					{description ? (
						<motion.p
							custom={eyebrow ? 0.18 : 0.12}
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
		</motion.div>
	)
}

export default SectionHeader
