import type { Metadata } from 'next'
import './app.css'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { JsonLd } from './components/json-ld'
import PageTransition from './components/page-transition'
import Footer from './components/sections/footer'
import SiteHeader from './components/site-header'
import Provider from './contexts/provider'
import {
	createWebsiteJsonLd,
	PERSON_DESCRIPTION,
	PERSON_TAGLINE
} from './lib/structured-data'

export const metadata: Metadata = {
	title: `Robert Eggl - ${PERSON_TAGLINE}`,
	description: PERSON_DESCRIPTION,
	keywords:
		'Robert Eggl, SAP, Fullstack Developer, Business Process Consultant, Enterprise Software, Cloud Computing, Full-Stack Development, Artificial Intelligence, Open Source, Portfolio',
	authors: [{ name: 'Robert Eggl' }],
	robots: 'index, follow',
	openGraph: {
		title: `Robert Eggl - ${PERSON_TAGLINE}`,
		description: PERSON_DESCRIPTION,
		type: 'website',
		url: 'https://eggl.dev'
	},
	metadataBase: new URL('https://eggl.dev'),
	creator: 'Robert Eggl',
	publisher: 'Robert Eggl',
	category: 'Technology',
	classification: 'Technology',
	applicationName: 'Robert Eggl',
	appleWebApp: {
		title: 'Robert Eggl',
		capable: true,
		statusBarStyle: 'default'
	}
}

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-grotesk',
	display: 'swap'
})

const mono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-mono',
	display: 'swap'
})

const websiteJsonLd = createWebsiteJsonLd()

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${spaceGrotesk.variable} ${mono.variable} overflow-x-hidden min-w-0`}
		>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="theme-color"
					content="#F2F4F6"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#0B0D10"
					media="(prefers-color-scheme: dark)"
				/>
				<link rel="me" href="https://social.tchncs.de/@roberteggl" />
				<meta name="fediverse:creator" content="@roberteggl@social.tchncs.de" />
				<link rel="canonical" href="https://eggl.dev" />
				<link
					rel="alternate"
					type="application/rss+xml"
					title="RSS Feed for Robert Eggl's Blog"
					href="https://eggl.dev/feed"
				/>
				<JsonLd data={websiteJsonLd} />
			</head>
			<body className="flex flex-col min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-background text-foreground">
				<Provider>
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-none focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:text-primary-foreground"
					>
						Skip to content
					</a>
					<SiteHeader />
					<main
						id="main-content"
						className="relative z-10 flex-grow w-full max-w-full mx-auto min-w-0 overflow-x-hidden"
					>
						<PageTransition>{children}</PageTransition>
					</main>
					<Footer />
				</Provider>
			</body>
		</html>
	)
}
