'use client'

import { useLayoutEffect } from 'react'

const REVEAL_SELECTOR = [
	'section:not(.hero-section) h2',
	'section:not(.hero-section) h3',
	'section:not(.hero-section) p',
	'section:not(.hero-section) figcaption',
	'section:not(.hero-section) li:not(:has(h3, p))',
	'section:not(.hero-section) .soft-target:not(:has(h2, h3, p))'
].join(', ')

/**
 * Homepage-only soft reveals (FluidVoice data-in pattern).
 * Mount this only on `/` — other routes stay sharp with no enter animation.
 */
export default function SoftPage() {
	useLayoutEffect(() => {
		const root = document.getElementById('main-content')
		if (!root) return

		root.dataset.soft = ''

		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches

		const targets = [...root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)]

		const reveal = (el: Element) => {
			el.setAttribute('data-in', '')
		}

		if (reduceMotion) {
			for (const el of targets) reveal(el)
			return () => {
				delete root.dataset.soft
			}
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue
					reveal(entry.target)
					observer.unobserve(entry.target)
				}
			},
			{
				rootMargin: '0px 0px -10% 0px',
				threshold: 0.05
			}
		)

		const vh = window.innerHeight
		for (const el of targets) {
			const rect = el.getBoundingClientRect()
			if (rect.top < vh * 0.9 && rect.bottom > 40) {
				reveal(el)
			} else {
				observer.observe(el)
			}
		}

		return () => {
			observer.disconnect()
			delete root.dataset.soft
		}
	}, [])

	return null
}
