import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjectImageUrl } from '@/data/projects-data'
import { PERSON_JOB_TITLE } from '@/lib/structured-data'

interface ProjectLayoutProps {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const project = getProjectBySlug(slug)

	if (!project) {
		return {
			title: 'Project Not Found - Robert Eggl',
			description: 'The requested project could not be found.'
		}
	}

	const imageUrl = getProjectImageUrl(project.image)

	return {
		title: `${project.title} - Robert Eggl`,
		description: project.description,
		keywords: [
			'Robert Eggl',
			project.title,
			...project.technologies,
			project.category
		].join(', '),
		authors: [{ name: 'Robert Eggl' }],
		robots: 'index, follow',
		openGraph: {
			title: project.title,
			description: project.description,
			type: 'article',
			url: `https://eggl.dev/projects/${project.slug}`,
			siteName: 'Robert Eggl',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: `${project.title} screenshot`
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: project.title,
			description: project.description,
			images: [imageUrl]
		}
	}
}

const generateJsonLd = (
	project: NonNullable<ReturnType<typeof getProjectBySlug>>
) => ({
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: project.title,
	description: project.description,
	applicationCategory: project.category,
	operatingSystem: 'Web',
	url:
		project.demo ?? project.docs ?? `https://eggl.dev/projects/${project.slug}`,
	image: getProjectImageUrl(project.image),
	author: {
		'@type': 'Person',
		name: 'Robert Eggl',
		url: 'https://eggl.dev',
		jobTitle: PERSON_JOB_TITLE
	},
	keywords: project.technologies.join(', '),
	...(project.github && {
		codeRepository: project.github
	})
})

export default async function ProjectLayout({
	children,
	params
}: ProjectLayoutProps) {
	const { slug } = await params
	const project = getProjectBySlug(slug)

	if (!project) {
		notFound()
	}

	const jsonLd = generateJsonLd(project)

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: not a problem
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
				}}
			/>
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{children}
			</div>
		</>
	)
}
