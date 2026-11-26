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
			<span aria-hidden="true" className="inline-block h-[34px] w-[34px]" />
		)
	}

	const isDark = resolvedTheme === 'dark'

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="rounded-none p-2 text-black/70 transition-colors duration-150 hover:bg-black/5 hover:text-accent dark:text-white/70 dark:hover:bg-white/10"
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
