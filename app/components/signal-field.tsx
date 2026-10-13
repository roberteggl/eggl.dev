'use client'
import { type ReactNode, type RefObject, useEffect, useRef } from 'react'

type MeshKind = 'perspective' | 'circles'

function lineColors() {
	const dark = document.documentElement.classList.contains('dark')
	return dark
		? {
				top: 'rgba(14, 18, 23, 0.35)',
				bottom: 'rgba(14, 18, 23, 0.12)',
				glow: 'rgba(14, 18, 23, 0.25)',
				ring: 'rgba(14, 18, 23, 0.28)'
			}
		: {
				top: 'rgba(242, 244, 246, 0.45)',
				bottom: 'rgba(45, 212, 191, 0.18)',
				glow: 'rgba(242, 244, 246, 0.35)',
				ring: 'rgba(242, 244, 246, 0.38)'
			}
}

/** Perspective vanishing grid (GitHub activity). */
function usePerspectiveGrid(canvasRef: RefObject<HTMLCanvasElement | null>) {
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		const resizeCanvas = () => {
			const parent = canvas.parentElement
			canvas.width = parent?.clientWidth || window.innerWidth
			canvas.height = parent?.clientHeight || window.innerHeight
		}

		window.addEventListener('resize', resizeCanvas)
		const ro = new ResizeObserver(resizeCanvas)
		if (canvas.parentElement) ro.observe(canvas.parentElement)
		resizeCanvas()

		let animationId = 0
		let running = true

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
			ro.disconnect()
			cancelAnimationFrame(animationId)
			themeObserver.disconnect()
		}
	}, [canvasRef])
}

/** Concentric circles from bottom-right (Skills). */
function useCirclesMesh(canvasRef: RefObject<HTMLCanvasElement | null>) {
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const resizeCanvas = () => {
			const parent = canvas.parentElement
			canvas.width = parent?.clientWidth || window.innerWidth
			canvas.height = parent?.clientHeight || window.innerHeight
			draw()
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			const colors = lineColors()

			const cx = canvas.width * 0.9
			const cy = canvas.height * 0.85
			const maxR = Math.hypot(canvas.width, canvas.height) * 1.05
			const ringCount = 10

			ctx.strokeStyle = colors.ring
			ctx.shadowBlur = 4
			ctx.shadowColor = colors.glow

			for (let i = 1; i <= ringCount; i++) {
				const r = (i / ringCount) * maxR
				ctx.beginPath()
				ctx.arc(cx, cy, r, 0, Math.PI * 2)
				ctx.lineWidth = i % 3 === 0 ? 1.5 : 1
				ctx.globalAlpha = 0.3 + (i / ringCount) * 0.4
				ctx.stroke()
			}

			ctx.globalAlpha = 1
			ctx.shadowBlur = 0
		}

		window.addEventListener('resize', resizeCanvas)
		const ro = new ResizeObserver(resizeCanvas)
		if (canvas.parentElement) ro.observe(canvas.parentElement)
		resizeCanvas()

		const themeObserver = new MutationObserver(draw)
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		})

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			ro.disconnect()
			themeObserver.disconnect()
		}
	}, [canvasRef])
}

interface SignalFieldProps {
	id?: string
	className?: string
	contentClassName?: string
	/** Background mesh: perspective grid (default) or concentric circles. */
	mesh?: MeshKind
	children: ReactNode
}

function PerspectiveCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	usePerspectiveGrid(canvasRef)
	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute inset-0 h-full w-full"
		/>
	)
}

function CirclesCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	useCirclesMesh(canvasRef)
	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute inset-0 h-full w-full"
		/>
	)
}

/** Full-bleed accent panel with a mesh background that scrolls with the section. */
export default function SignalField({
	id,
	className = '',
	contentClassName = 'container-custom relative z-10 py-16 md:py-20',
	mesh = 'perspective',
	children
}: SignalFieldProps) {
	return (
		<section
			id={id}
			className={`relative scroll-mt-24 overflow-hidden ${className}`}
		>
			<div aria-hidden="true" className="absolute inset-0 z-0 w-full bg-accent">
				{mesh === 'circles' ? <CirclesCanvas /> : <PerspectiveCanvas />}
			</div>
			<div className={contentClassName}>{children}</div>
		</section>
	)
}
