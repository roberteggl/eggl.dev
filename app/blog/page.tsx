'use client'
import { allBlogs } from 'contentlayer/generated'
import { ArrowUpRight, Rss } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
	const posts = allBlogs.sort(
		(a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
	)

	return (
		<div className="container-custom pb-24 pt-28 md:pt-36">
			<header className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
				<div className="max-w-2xl">
					<div className="mb-5 flex items-center gap-3">
						<span className="inline-flex items-center border border-accent/40 bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
							01
						</span>
						<span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
							Notes
						</span>
					</div>
					<h1 className="font-display text-5xl tracking-tight md:text-6xl">
						Blog.
					</h1>
					<p className="mt-4 text-lg leading-relaxed text-muted-foreground">
						Notes on software, open source, enterprise systems, and AI.
					</p>
				</div>
				<a
					href="/api/feed"
					className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
					title="Subscribe to RSS feed"
					aria-label="Subscribe to RSS feed"
				>
					<Rss size={15} strokeWidth={1.75} />
					RSS
				</a>
			</header>

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
									className="group grid gap-4 py-7 transition-colors duration-150 hover:bg-surface/50 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-8 md:px-2 md:py-8"
								>
									<span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
										<span className="text-foreground">{day}</span> {month}{' '}
										{year}
									</span>
									<span className="min-w-0">
										<span className="font-display text-2xl tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent md:text-[1.75rem]">
											{post.title}
										</span>
										<span className="mt-2 block max-w-3xl text-[15px] leading-relaxed text-muted-foreground line-clamp-2">
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
				<div className="signal-card mx-auto max-w-md p-12 text-center">
					<h3 className="font-display text-xl">No posts yet</h3>
					<p className="mt-2 text-muted-foreground">
						I&rsquo;m working on some interesting content. Check back soon!
					</p>
				</div>
			)}
		</div>
	)
}
