import { withContentlayer } from 'next-contentlayer2'

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_GIT_SHA:
			process.env.NEXT_PUBLIC_GIT_SHA ??
			process.env.VERCEL_GIT_COMMIT_SHA ??
			'development'
	},
	images: {
		unoptimized: true
	},
	output: 'standalone',
	experimental: {
		optimizePackageImports: ['framer-motion', 'lucide-react']
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production'
	},
	reactCompiler: true,
	poweredByHeader: false
}

export default withContentlayer(nextConfig)
