import type { ReactNode } from 'react'

/** Pass-through — no route enter animation (avoids shift/lag). */
export default function PageTransition({ children }: { children: ReactNode }) {
	return children
}
