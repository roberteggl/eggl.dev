import type * as React from 'react'

interface MagneticProps {
	children: React.ReactNode
	className?: string
	strength?: number
}

/** Pass-through — magnetic drift removed (felt laggy). */
export function Magnetic({ children, className }: MagneticProps) {
	return <div className={className}>{children}</div>
}
