import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const blogs = defineCollection({
	name: 'blogs',
	directory: 'posts',
	include: '**/*.md',
	schema: z.object({
		title: z.string(),
		date: z.string(),
		description: z.string().optional(),
		content: z.string()
	}),
	transform: async (document, context) => {
		const code = await compileMDX(context, document, {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [rehypeSlug]
		})

		return {
			...document,
			slug: document._meta.path,
			_id: document._meta.filePath,
			body: {
				raw: document.content,
				code
			}
		}
	}
})

export default defineConfig({
	content: [blogs]
})
