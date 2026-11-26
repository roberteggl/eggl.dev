import { allBlogs } from 'content-collections'
import { ArrowUpRight, Rss } from 'lucide-react'
import Link from 'next/link'
import BlogYearIndex from '@/components/blog-year-index'
import PageHero from '@/components/page-hero'

function readingTime(raw: string) {
	return Math.max(1, Math.ceil(raw.split(/\s+/).length / 150))
}

function formatDate(value: string) {
	const date = new Date(value)
	return {
		day: date.toLocaleDateString('en-US', { day: '2-digit' }),
		month: date.toLocaleDateString('en-US', { month: 'short' }),
		year: date.getFullYear()
	}
}

export default function BlogPage() {
	const posts = allBlogs.sort(
		(a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
	)
	const [featured, ...rest] = posts

	const yearCounts = new Map<number, number>()
	for (const post of posts) {
		const year = new Date(post.date).getFullYear()
		yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
	}
	const years = [...yearCounts.entries()]
		.map(([year, count]) => ({ year, count }))
		.sort((a, b) => b.year - a.year)

	let lastYear = featured ? new Date(featured.date).getFullYear() : null

	return (
		<div className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%)]"
			/>

			<BlogYearIndex years={years} />

			<div className="container-custom relative pb-24 pt-28 md:pt-36">
				<PageHero
					eyebrow="Writing"
					title="Blog."
					description={`${posts.length} notes on software, open source, enterprise systems, and AI.`}
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

				{featured ? (
					<>
						<Link
							id={`year-${new Date(featured.date).getFullYear()}`}
							href={`/blog/${featured.slug}`}
							className="group relative block scroll-mt-28 py-2 pl-5 transition-colors duration-200"
						>
							<span
								aria-hidden="true"
								className="absolute bottom-0 left-0 top-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
							/>
							<div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
								<span className="text-accent">Latest</span>
								<span aria-hidden="true" className="text-line">
									·
								</span>
								<span>
									{(() => {
										const { day, month, year } = formatDate(featured.date)
										return (
											<>
												<span className="text-foreground">{day}</span> {month}{' '}
												{year}
											</>
										)
									})()}
								</span>
								<span aria-hidden="true" className="text-line">
									·
								</span>
								<span>{readingTime(featured.body.raw)} min</span>
							</div>
							<h2 className="mt-4 max-w-4xl font-display text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent">
								{featured.title}
							</h2>
							<p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
								{featured.description}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-accent">
								Read
								<ArrowUpRight
									size={15}
									className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</span>
						</Link>

						{rest.length > 0 ? (
							<ul className="mt-12 border-t border-line md:mt-16">
								{rest.map((post, index) => {
									const { day, month, year } = formatDate(post.date)
									const mins = readingTime(post.body.raw)
									const n = String(index + 1).padStart(2, '0')
									const yearAnchor =
										year !== lastYear ? `year-${year}` : undefined
									if (year !== lastYear) lastYear = year

									return (
										<li
											key={post._id}
											id={yearAnchor}
											className={`border-b border-line ${yearAnchor ? 'scroll-mt-28' : ''}`}
										>
											<Link
												href={`/blog/${post.slug}`}
												className="group relative grid gap-3 py-7 pl-5 transition-colors duration-150 hover:bg-surface/30 sm:grid-cols-[3.5rem_7.5rem_1fr_auto] sm:items-baseline sm:gap-6 md:gap-8 md:py-8"
											>
												<span
													aria-hidden="true"
													className="absolute bottom-0 left-0 top-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
												/>
												<span className="hidden font-mono text-[11px] text-accent sm:block">
													{n}
												</span>
												<span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
													<span className="text-foreground">{day}</span> {month}{' '}
													{year}
												</span>
												<span className="min-w-0">
													<span className="font-display text-xl tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent md:text-2xl">
														{post.title}
													</span>
													<span className="mt-2 line-clamp-2 block max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
														{post.description}
													</span>
												</span>
												<span className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground sm:justify-end">
													{mins} min
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
						) : null}
					</>
				) : (
					<div className="py-14">
						<h3 className="font-display text-xl tracking-tight">
							No posts yet
						</h3>
						<p className="mt-2 text-muted-foreground">
							I&rsquo;m working on some interesting content. Check back soon!
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
