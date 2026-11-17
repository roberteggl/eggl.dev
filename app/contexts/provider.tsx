'use client'
import { ThemeProvider } from 'next-themes'

const Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	)
}

export default Provider
