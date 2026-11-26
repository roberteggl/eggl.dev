import type { MetadataRoute } from 'next'
import { PERSON_DESCRIPTION, PERSON_TAGLINE } from '@/lib/structured-data'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `Robert Eggl - ${PERSON_TAGLINE}`,
		short_name: 'Robert Eggl',
		description: PERSON_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		background_color: '#050607',
		theme_color: '#0f766e',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon'
			},
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			}
		]
	}
}
