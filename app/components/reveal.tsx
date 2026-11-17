'use client'

import type * as React from 'react'

export const revealEase = [0.22, 1, 0.36, 1] as const

/** Structural wrapper — blur is handled by CSS view() / SoftPage. */
export function Reveal({
	children,
	className,
	as: Tag = 'div'
}: {
	children: React.ReactNode
	delay?: number
	y?: number
	blur?: number
	className?: string
	once?: boolean
	as?: 'div' | 'span' | 'li'
}) {
	return <Tag className={className}>{children}</Tag>
}

export function Stagger({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
	delay?: number
	stagger?: number
	once?: boolean
}) {
	return (
		<div className={className} data-rise="">
			{children}
		</div>
	)
}

export function StaggerItem({
	children,
	className,
	index = 0
}: {
	children: React.ReactNode
	className?: string
	y?: number
	blur?: number
	index?: number
}) {
	return (
		<div
			className={`soft-target ${className ?? ''}`}
			data-rise-item=""
			style={{ ['--i' as string]: index }}
		>
			{children}
		</div>
	)
}

export function LineGrow({ className = '' }: { className?: string }) {
	return (
		<div aria-hidden="true" className={`h-px w-full bg-line ${className}`} />
	)
}
