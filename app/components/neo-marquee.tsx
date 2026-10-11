'use client'
import Ticker from './ticker'

interface NeoMarqueeProps {
	text: string
	speed?: number
	backgroundColor?: string
	textColor?: string
	className?: string
	repeat?: number
	fullBleed?: boolean
}

/** Back-compat wrapper: old NeoMarquee API → new thin Ticker. */
const NeoMarquee = ({ text, className = '' }: NeoMarqueeProps) => {
	const items = text
		.split('•')
		.map((s) => s.trim())
		.filter(Boolean)
	return <Ticker items={items} className={className} />
}

export default NeoMarquee
