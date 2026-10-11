import type * as React from 'react'

interface RevealProps {
	children: React.ReactNode
	delay?: number
	y?: number
	className?: string
	once?: boolean
	as?: 'div' | 'span' | 'li'
}

/** Static wrapper — entrance motion removed for snappy feel. */
export function Reveal({ children, className }: RevealProps) {
	return <div className={className}>{children}</div>
}

interface StaggerProps {
	children: React.ReactNode
	className?: string
	delay?: number
}

export function Stagger({ children, className }: StaggerProps) {
	return <div className={className}>{children}</div>
}

export function StaggerItem({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return <div className={className}>{children}</div>
}

export function LineGrow({ className = '' }: { className?: string }) {
	return (
		<div aria-hidden="true" className={`h-px w-full bg-line ${className}`} />
	)
}
