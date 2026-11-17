'use client'
import { allBlogs } from 'contentlayer/generated'
import { ArrowUpRight, Rss } from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/page-hero'

export default function BlogPage() {
	const posts = allBlogs.sort(
		(a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
	)

	return (
		<div className="container-custom pb-24 pt-28 md:pt-36">
			<PageHero
				eyebrow="Writing"
				title="Blog."
				description="Notes on software, open source, enterprise systems, and AI."
				action={
					<a
						href="/api/feed"
						className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
						title="Subscribe to RSS feed"
						aria-label="Subscribe to RSS feed"
					>
						<Rss size={15} strokeWidth={1.75} />
						RSS
					</a>
				}
			/>

			{posts.length > 0 ? (
				<ul className="divide-y divide-line border-y border-line">
					{posts.map((post) => {
						const wordCount = post.body.raw.split(' ').length
						const readingTime = Math.ceil(wordCount / 150)
						const date = new Date(post.date)
						const day = date.toLocaleDateString('en-US', { day: '2-digit' })
						const month = date.toLocaleDateString('en-US', { month: 'short' })
						const year = date.getFullYear()

						return (
							<li key={post._id}>
								<Link
									href={`/blog/${post.slug}`}
									className="group grid gap-4 py-7 transition-colors duration-150 hover:bg-surface/40 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-8 md:px-2 md:py-8"
								>
									<span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
										<span className="text-foreground">{day}</span> {month}{' '}
										{year}
									</span>
									<span className="min-w-0">
										<span className="font-display text-2xl tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent md:text-[1.75rem]">
											{post.title}
										</span>
										<span className="mt-2 line-clamp-2 block max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
											{post.description}
										</span>
									</span>
									<span className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground sm:justify-end">
										{readingTime} min
										<ArrowUpRight
											size={16}
											className="text-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100"
										/>
									</span>
								</Link>
							</li>
						)
					})}
				</ul>
			) : (
				<div className="border border-line bg-surface px-8 py-14 text-center">
					<h3 className="font-display text-xl tracking-tight">No posts yet</h3>
					<p className="mt-2 text-muted-foreground">
						I&rsquo;m working on some interesting content. Check back soon!
					</p>
				</div>
			)}
		</div>
	)
}
