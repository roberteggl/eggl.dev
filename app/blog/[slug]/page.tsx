import { allBlogs } from 'contentlayer/generated'
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXContent } from './mdx-content'

export const generateStaticParams = async () =>
	allBlogs.map((p) => ({ slug: p.slug }))

export default async function BlogPostPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const post = allBlogs.find((p) => p.slug === slug)
	if (!post) return notFound()

	const wordCount = post.body.raw.split(' ').length
	const readingTime = Math.ceil(wordCount / 150)

	const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})

	return (
		<article className="container-custom max-w-3xl pb-24 pt-32 md:pt-40">
			<header className="mb-10 border-b border-line pb-10">
				<div className="mb-5 flex items-center gap-3">
					<span className="inline-flex items-center border border-accent/40 bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
						Essay
					</span>
				</div>
				<h1 className="font-display text-4xl leading-[1.08] tracking-tight text-balance md:text-5xl">
					{post.title}
				</h1>

				<div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px] text-muted-foreground">
					<span className="inline-flex items-center gap-1.5">
						<Calendar size={14} className="text-accent" />
						{formattedDate}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock size={14} className="text-accent" />
						{readingTime} min read
					</span>
					<span className="inline-flex items-center gap-1.5">
						<BookOpen size={14} className="text-accent" />
						{wordCount} words
					</span>
				</div>

				{post.description && (
					<p className="mt-6 border-l-2 border-accent pl-5 text-lg leading-relaxed text-foreground/75 md:text-xl">
						{post.description}
					</p>
				)}
			</header>

			<div className="prose max-w-none">
				<MDXContent code={post.body.code} />
			</div>

			<footer className="mt-14 border-t border-line pt-8">
				<Link
					href="/blog"
					className="group inline-flex items-center gap-2 border-b border-accent/40 pb-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
				>
					<ArrowLeft
						size={15}
						className="transition-transform duration-300 group-hover:-translate-x-1"
					/>
					All essays
				</Link>
			</footer>
		</article>
	)
}
