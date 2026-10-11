'use client'
import { type RefObject, useEffect, useRef, useState } from 'react'
import type { GitHubData } from '@/lib/github'
import GitHubStatsSection from '../github/github-stats-ection'
import { Reveal } from '../reveal'
import SectionHeader from '../section-header'

const emptyData: GitHubData = {
	contributions: [],
	stats: {
		followers: 0,
		stars: 0,
		contributions: 0,
		pullRequests: 0,
		topLanguages: []
	}
}

const LoadingState = () => (
	<output aria-busy="true" className="block">
		<div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="luxe-card flex animate-pulse items-center gap-3 px-3.5 py-3"
				>
					<div className="h-8 w-8 shrink-0 rounded-none bg-line/70" />
					<div className="min-w-0 flex-1 space-y-1.5">
						<div className="h-5 w-14 rounded-none bg-line/70" />
						<div className="h-3 w-20 rounded-none bg-line/60" />
					</div>
				</div>
			))}
		</div>
		<div className="luxe-card mt-6 animate-pulse p-5">
			<div className="h-32 rounded-none bg-line/50" />
		</div>
	</output>
)

/** Perspective signal grid, clipped to the section via fixed + clip-path. */
function useSignalGrid(canvasRef: RefObject<HTMLCanvasElement | null>) {
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		const resizeCanvas = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}

		window.addEventListener('resize', resizeCanvas)
		resizeCanvas()

		let animationId = 0
		let running = true

		const lineColors = () => {
			const dark = document.documentElement.classList.contains('dark')
			return dark
				? {
						top: 'rgba(14, 18, 23, 0.35)',
						bottom: 'rgba(14, 18, 23, 0.12)',
						glow: 'rgba(14, 18, 23, 0.25)'
					}
				: {
						top: 'rgba(242, 244, 246, 0.45)',
						bottom: 'rgba(45, 212, 191, 0.18)',
						glow: 'rgba(242, 244, 246, 0.35)'
					}
		}

		const drawGrid = (time: number) => {
			if (!running) return

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			const colors = lineColors()
			const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
			gradient.addColorStop(0, colors.top)
			gradient.addColorStop(1, colors.bottom)

			ctx.strokeStyle = gradient
			ctx.lineWidth = 1.25
			ctx.shadowBlur = 8
			ctx.shadowColor = colors.glow

			const horizontalLines = 24
			const verticalLines = 28
			const horizonY = canvas.height * 0.22
			const t = reduceMotion ? 0 : time * 0.00035
			const waveAmplitude = canvas.height * 0.03
			const waveFrequency = (Math.PI / canvas.width) * 2.8

			for (let i = 0; i <= horizontalLines; i++) {
				const progress = i / horizontalLines
				const y = horizonY + progress ** 1.5 * (canvas.height - horizonY)

				ctx.beginPath()
				for (let x = 0; x <= canvas.width; x += 6) {
					const normalizedX = x / canvas.width
					const distanceFromHorizon = (y - horizonY) / canvas.height
					const waveEffect =
						Math.sin(x * waveFrequency + t) *
						waveAmplitude *
						(1 - distanceFromHorizon ** 0.7)
					const distFromCenter = (normalizedX - 0.5) * 2
					const perspectiveCurve =
						distFromCenter ** 2 * canvas.height * 0.14 * (1 - progress)
					const yPos = y - waveEffect - perspectiveCurve

					if (x === 0) ctx.moveTo(x, yPos)
					else ctx.lineTo(x, yPos)
				}
				ctx.stroke()
			}

			for (let i = 0; i <= verticalLines; i++) {
				const progress = i / verticalLines
				ctx.beginPath()

				const vanishX = canvas.width * 0.5
				const baseX = (progress - 0.5) * canvas.width * 2 + vanishX
				const oscillation =
					Math.sin(t * 0.5 + progress * Math.PI * 2) * canvas.width * 0.018

				for (let j = -20; j <= 100; j++) {
					const segmentProgress = j / 100
					const y = horizonY + segmentProgress * (canvas.height - horizonY)
					const convergeFactor = (1 - segmentProgress) ** 1.8
					const x =
						vanishX +
						(baseX - vanishX) * (segmentProgress + convergeFactor) +
						oscillation * Math.abs(segmentProgress)

					if (j === -20) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.stroke()
			}

			ctx.shadowBlur = 0

			if (!reduceMotion) {
				animationId = requestAnimationFrame(drawGrid)
			}
		}

		animationId = requestAnimationFrame(drawGrid)

		const themeObserver = new MutationObserver(() => {
			if (reduceMotion) drawGrid(0)
		})
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		})

		return () => {
			running = false
			window.removeEventListener('resize', resizeCanvas)
			cancelAnimationFrame(animationId)
			themeObserver.disconnect()
		}
	}, [canvasRef])
}

const CareerSection = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [githubData, setGitHubData] = useState<GitHubData>(emptyData)
	const [isLoading, setIsLoading] = useState(true)

	useSignalGrid(canvasRef)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('/api/github')
				if (res.ok) {
					const data: GitHubData = await res.json()
					setGitHubData(data)
				}
			} catch (error) {
				console.error('Failed to fetch GitHub data', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<section id="activity" className="relative scroll-mt-24 overflow-hidden">
			{/* Sticky signal field: fixed canvas clipped to this section */}
			<div
				aria-hidden="true"
				className="absolute inset-0 z-0 w-full bg-accent"
				style={{ clipPath: 'inset(0)' }}
			>
				<canvas
					ref={canvasRef}
					className="pointer-events-none fixed inset-0 h-full w-full"
				/>
			</div>

			<div className="container-custom relative z-10 py-16 md:py-20">
				<SectionHeader
					number="05"
					eyebrow="Activity"
					title="GitHub activity."
					description="Contributions, languages, commit history, live from GitHub."
					invert
					mbSize="mb-8 md:mb-10"
				/>
				<div className="[&_h4]:text-accent-foreground/75 [&_h4_.text-accent]:text-accent-foreground [&_.luxe-chip]:border-accent-foreground/25 [&_.luxe-chip]:bg-accent-foreground/10 [&_.luxe-chip]:text-accent-foreground">
					<Reveal>
						{isLoading ? (
							<LoadingState />
						) : (
							<GitHubStatsSection githubData={githubData} />
						)}
					</Reveal>
				</div>
			</div>
		</section>
	)
}

export default CareerSection
