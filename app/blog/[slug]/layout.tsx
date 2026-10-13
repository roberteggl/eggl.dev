import { allBlogs } from 'contentlayer/generated'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PERSON_JOB_TITLE } from '@/lib/structured-data'

interface BlogPostLayoutProps {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const post = allBlogs.find((p) => p.slug === slug)

	if (!post) {
		return {
			title: 'Blog Post Not Found - Robert Eggl',
			description: 'The requested blog post could not be found.'
		}
	}

	const wordCount = post.body.raw.split(' ').length
	const readingTime = Math.ceil(wordCount / 200)

	return {
		title: `${post.title} - Robert Eggl`,
		description:
			post.description ||
			`Read ${post.title} by Robert Eggl. ${readingTime} minute read.`,
		keywords: [
			'blog',
			'Robert Eggl',
			post.title,
			'software development',
			'technology',
			'tutorial',
			'article'
		].join(', '),
		authors: [{ name: 'Robert Eggl' }],
		robots: 'index, follow',
		openGraph: {
			title: post.title,
			description: post.description || `Read ${post.title} by Robert Eggl.`,
			type: 'article',
			url: `https://eggl.dev/blog/${post.slug}`,
			siteName: 'Robert Eggl',
			images: [
				{
					url: 'https://eggl.dev/opengraph-image.jpg',
					width: 1200,
					height: 630,
					alt: post.title
				}
			],
			publishedTime: post.date,
			modifiedTime: post.date,
			authors: ['Robert Eggl']
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.description || `Read ${post.title} by Robert Eggl.`,
			images: ['https://eggl.dev/opengraph-image.jpg']
		},
		other: {
			'og:locale': 'en_US',
			'og:type': 'article',
			'article:author': 'Robert Eggl',
			'article:published_time': post.date,
			'article:modified_time': post.date
		}
	}
}

const generateJsonLd = (post: (typeof allBlogs)[0]) => ({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	headline: post.title,
	description: post.description,
	author: {
		'@type': 'Person',
		name: 'Robert Eggl',
		url: 'https://eggl.dev',
		jobTitle: PERSON_JOB_TITLE
	},
	publisher: {
		'@type': 'Person',
		name: 'Robert Eggl',
		url: 'https://eggl.dev'
	},
	datePublished: post.date,
	dateModified: post.date,
	mainEntityOfPage: {
		'@type': 'WebPage',
		'@id': `https://eggl.dev/blog/${post.slug}`
	},
	url: `https://eggl.dev/blog/${post.slug}`,
	wordCount: post.body.raw.split(' ').length,
	articleSection: 'Technology',
	keywords: ['blog', 'software development', 'technology', post.title]
})

export default async function BlogPostLayout({
	children,
	params
}: BlogPostLayoutProps) {
	const { slug } = await params
	const post = allBlogs.find((p) => p.slug === slug)

	if (!post) {
		notFound()
	}

	const jsonLd = generateJsonLd(post)

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: not a problem
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
				}}
			/>
			{children}
		</>
	)
}
