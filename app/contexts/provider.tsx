'use client'
import { ThemeProvider } from 'next-themes'

const Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	)
}

export default Provider
