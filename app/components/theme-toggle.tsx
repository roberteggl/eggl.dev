'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) {
		return (
			<span
				aria-hidden="true"
				className="inline-block h-9 w-9 rounded-none border border-line"
			/>
		)
	}

	const isDark = resolvedTheme === 'dark'

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="group inline-flex h-9 w-9 items-center justify-center rounded-none border border-line bg-card text-foreground/70 transition-colors duration-200 hover:border-accent hover:text-accent"
		>
			<span className="relative block h-[18px] w-[18px]">
				<Sun
					size={18}
					className={`absolute inset-0 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'}`}
				/>
				<Moon
					size={18}
					className={`absolute inset-0 transition-all duration-300 ${isDark ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
				/>
			</span>
		</button>
	)
}
