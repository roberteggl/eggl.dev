import { allBlogs } from 'contentlayer/generated'
import { NextResponse } from 'next/server'

export async function GET() {
	const posts = allBlogs.sort(
		(a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
	)

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Robert Eggl - The Blog.</title>
    <link>https://eggl.dev/blog</link>
    <description>Thoughts, tutorials, and insights on software development, design, and technology.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://eggl.dev/feed" rel="self" type="application/rss+xml" />
    ${posts
			.map((post) => {
				const pubDate = new Date(post.date).toUTCString()
				// Get the first 250 characters of the post content (excluding frontmatter)
				const contentPreview = post.body.raw
					.replace(/^---[\s\S]*?---/, '') // Remove frontmatter
					.trim()
					.substring(0, 250)
					.replace(/\n/g, ' ') // Replace newlines with spaces
					.replace(/\s+/g, ' ') // Replace multiple spaces with single space
					.trim()

				// Combine description with content preview
				const fullDescription = post.description
					? `${post.description}\n\n${contentPreview}${contentPreview.length === 250 ? '...' : ''}`
					: `${contentPreview}${contentPreview.length === 250 ? '...' : ''}`

				const postUrl = `https://eggl.dev/blog/${post.slug}`

				return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${fullDescription}]]></description>
      <author>Robert Eggl</author>
    </item>`
			})
			.join('\n')}
  </channel>
</rss>`

	return new NextResponse(rss, {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	})
}
