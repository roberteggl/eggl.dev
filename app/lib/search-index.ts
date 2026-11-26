import { allBlogs } from 'content-collections'
import { defaultFilter } from 'cmdk'
import {
	getAllProjects,
	PROJECT_CATEGORY_LABELS,
	type Project
} from '@/data/projects-data'

/** Drop weak command-score noise; keep typo-tolerant title hits. */
const FUZZY_TITLE_MIN = 0.42
const FUZZY_KEYWORD_MIN = 0.55

export type SearchGroup =
	| 'pages'
	| 'sections'
	| 'projects'
	| 'posts'
	| 'actions'

export type SearchItem = {
	id: string
	group: SearchGroup
	title: string
	description?: string
	href: string
	/** Extra tokens for search — keep short and specific */
	keywords: string[]
	external?: boolean
	sectionId?: string
	action?: 'theme'
}

const PAGES: SearchItem[] = [
	{
		id: 'page-home',
		group: 'pages',
		title: 'Home',
		description: 'Landing page',
		href: '/',
		keywords: ['index']
	},
	{
		id: 'page-projects',
		group: 'pages',
		title: 'Projects',
		description: 'All work and experiments',
		href: '/projects',
		keywords: ['portfolio', 'work']
	},
	{
		id: 'page-blog',
		group: 'pages',
		title: 'Blog',
		description: 'Writing and notes',
		href: '/blog',
		keywords: ['posts', 'writing', 'articles']
	},
	{
		id: 'page-keys',
		group: 'pages',
		title: 'GPG Keys',
		description: 'Public keys and verification',
		href: '/keys',
		keywords: ['pgp', 'gpg', 'crypto', 'signature']
	},
	{
		id: 'page-imprint',
		group: 'pages',
		title: 'Imprint',
		description: 'Legal notice',
		href: '/legal/imprint',
		keywords: ['impressum', 'legal']
	},
	{
		id: 'page-privacy',
		group: 'pages',
		title: 'Privacy',
		description: 'Privacy policy',
		href: '/legal/privacy',
		keywords: ['legal', 'policy']
	}
]

const SECTIONS: SearchItem[] = [
	{
		id: 'section-projects',
		group: 'sections',
		title: 'Work',
		description: 'Featured projects on the home page',
		href: '/#projects',
		sectionId: 'projects',
		keywords: ['projects', 'featured']
	},
	{
		id: 'section-about',
		group: 'sections',
		title: 'About',
		description: 'Who I am and what I build',
		href: '/#about',
		sectionId: 'about',
		keywords: ['bio']
	},
	{
		id: 'section-experience',
		group: 'sections',
		title: 'Journey',
		description: 'Education and experience',
		href: '/#experience',
		sectionId: 'experience',
		keywords: ['career', 'education', 'experience']
	},
	{
		id: 'section-activity',
		group: 'sections',
		title: 'Proof',
		description: 'GitHub activity and signals',
		href: '/#activity',
		sectionId: 'activity',
		keywords: ['activity', 'stats', 'contributions']
	},
	{
		id: 'section-contact',
		group: 'sections',
		title: 'Contact',
		description: 'Get in touch',
		href: '/#contact',
		sectionId: 'contact',
		keywords: ['email', 'mail']
	}
]

const ACTIONS: SearchItem[] = [
	{
		id: 'action-theme',
		group: 'actions',
		title: 'Toggle theme',
		description: 'Switch light / dark',
		href: '#',
		action: 'theme',
		keywords: ['dark', 'light', 'mode', 'appearance']
	},
	{
		id: 'action-github',
		group: 'actions',
		title: 'GitHub',
		description: 'github.com/roberteggl',
		href: 'https://github.com/roberteggl',
		external: true,
		keywords: ['repos', 'code']
	},
	{
		id: 'action-linkedin',
		group: 'actions',
		title: 'LinkedIn',
		description: 'Professional profile',
		href: 'https://linkedin.com/in/roberteggl',
		external: true,
		keywords: ['social']
	},
	{
		id: 'action-email',
		group: 'actions',
		title: 'Email',
		description: 'info@eggl.dev',
		href: 'mailto:info@eggl.dev',
		external: true,
		keywords: ['mail', 'contact']
	},
	{
		id: 'action-rss',
		group: 'actions',
		title: 'RSS Feed',
		description: 'Subscribe to posts',
		href: '/api/feed',
		keywords: ['atom', 'feed', 'subscribe']
	}
]

function projectToSearchItem(project: Project): SearchItem {
	return {
		id: `project-${project.slug}`,
		group: 'projects',
		title: project.title,
		description: PROJECT_CATEGORY_LABELS[project.category],
		href: `/projects/${project.slug}`,
		keywords: [project.slug, project.category, ...project.technologies]
	}
}

function postToSearchItem(post: (typeof allBlogs)[number]): SearchItem {
	return {
		id: `post-${post.slug}`,
		group: 'posts',
		title: post.title,
		description: post.description ?? post.date,
		href: `/blog/${post.slug}`,
		keywords: [post.slug, ...(post.description ? [post.description] : [])]
	}
}

export const SEARCH_GROUP_LABELS: Record<SearchGroup, string> = {
	pages: 'Pages',
	sections: 'On this site',
	projects: 'Projects',
	posts: 'Blog',
	actions: 'Actions'
}

export const SEARCH_GROUP_ORDER: SearchGroup[] = [
	'pages',
	'sections',
	'projects',
	'posts',
	'actions'
]

export function getSearchIndex(): SearchItem[] {
	const projectItems = getAllProjects().map(projectToSearchItem)
	const postItems = [...allBlogs]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.map(postToSearchItem)

	return [...PAGES, ...SECTIONS, ...projectItems, ...postItems, ...ACTIONS]
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** True when `token` appears as its own word / word prefix in `haystack`. */
function matchesToken(haystack: string, token: string): boolean {
	if (!token) return true
	if (token.length <= 2) {
		return new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegExp(token)}`, 'i').test(
			haystack
		)
	}
	return haystack.includes(token)
}

/**
 * Prefer exact / substring hits, then light fuzzy (command-score) with a floor
 * so unrelated groups don't light up from letter scatter.
 */
export function searchFilter(
	value: string,
	search: string,
	keywords: string[] = []
): number {
	const query = search.trim().toLowerCase()
	if (!query) return 1

	const title = value.toLowerCase()
	const keywordList = keywords.map((k) => k.toLowerCase())
	const keywordText = keywordList.join(' ')
	const tokens = query.split(/\s+/).filter(Boolean)

	if (title === query) return 1
	if (title.startsWith(query)) return 0.95
	if (tokens.every((token) => matchesToken(title, token))) return 0.85

	if (keywordList.some((k) => k === query)) return 0.7
	if (tokens.every((token) => matchesToken(keywordText, token))) return 0.6

	const titleFuzzy = defaultFilter(value, search, [])
	if (titleFuzzy >= FUZZY_TITLE_MIN) return titleFuzzy * 0.75

	if (query.length >= 3 && keywords.length > 0) {
		const keywordFuzzy = defaultFilter(value, search, keywords)
		if (keywordFuzzy >= FUZZY_KEYWORD_MIN) return keywordFuzzy * 0.55
	}

	return 0
}
