import { allBlogs } from 'content-collections'
import type { FunctionTool } from 'openai/resources/responses/responses'
import { imprintData } from '@/data/imprint'
import {
	getAllProjects,
	getProjectBySlug,
	getProjectPath,
	type Project
} from '@/data/projects-data'
import { getGitHubData } from '@/lib/github'
import {
	PERSON_JOB_TITLE,
	PERSON_TAGLINE,
	personSameAs,
	SITE_URL
} from '@/lib/structured-data'

const EXCERPT_WORDS = 180

function projectCard(project: Project) {
	return {
		slug: project.slug,
		title: project.title,
		description: project.description,
		technologies: project.technologies,
		category: project.category,
		// Homepage highlights only — not a quality ranking.
		featured: Boolean(project.featured),
		showOnMain: Boolean(project.showOnMain),
		path: getProjectPath(project),
		github: project.github ?? null,
		demo: project.demo ?? null,
		docs: project.docs ?? null,
		blogPath: project.blog ? `/blog/${project.blog}` : null
	}
}

/** YYYY-MM-DD in Europe/Berlin (Robert’s timezone). */
function berlinDateString(date = new Date()) {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Berlin',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date)
}

/** Shift a YYYY-MM-DD calendar date by whole days (no timezone drift). */
function shiftIsoDate(isoDate: string, dayDelta: number) {
	const [year, month, day] = isoDate.split('-').map(Number)
	const utc = new Date(Date.UTC(year, month - 1, day + dayDelta))
	const y = utc.getUTCFullYear()
	const m = String(utc.getUTCMonth() + 1).padStart(2, '0')
	const d = String(utc.getUTCDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

function normalize(value: string) {
	return value.toLowerCase()
}

function matchesQuery(haystack: string, query: string) {
	const q = normalize(query).trim()
	if (!q) return true
	const tokens = q.split(/\s+/).filter(Boolean)
	const hay = normalize(haystack)
	return tokens.every((token) => hay.includes(token))
}

function excerpt(raw: string, maxWords = EXCERPT_WORDS) {
	const words = raw.replace(/\s+/g, ' ').trim().split(' ')
	if (words.length <= maxWords) return words.join(' ')
	return `${words.slice(0, maxWords).join(' ')}…`
}

async function searchSite(args: Record<string, unknown>) {
	const query = String(args.query ?? '')
	const limit = Math.min(12, Math.max(1, Number(args.limit ?? 6) || 6))

	const projects = getAllProjects()
		.filter((project) =>
			matchesQuery(
				[
					project.title,
					project.description,
					project.slug,
					project.category,
					...project.technologies
				].join(' '),
				query
			)
		)
		.slice(0, limit)
		.map(projectCard)

	const posts = allBlogs
		.filter((post) =>
			matchesQuery(
				[post.title, post.description ?? '', post.slug, post.body.raw].join(
					' '
				),
				query
			)
		)
		.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
		.slice(0, limit)
		.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.date,
			description: post.description ?? null,
			path: `/blog/${post.slug}`
		}))

	return {
		query,
		projects,
		posts,
		note:
			projects.length === 0 && posts.length === 0
				? 'No matches. Try a broader query or list recent work with a shorter keyword.'
				: null
	}
}

async function getProject(args: Record<string, unknown>) {
	const slug = String(args.slug ?? '').trim()
	const project = getProjectBySlug(slug)
	if (!project) {
		const suggestions = getAllProjects()
			.slice(0, 8)
			.map((item) => ({ slug: item.slug, title: item.title }))
		return { found: false, slug, suggestions }
	}
	return { found: true, project: projectCard(project) }
}

async function getBlogPost(args: Record<string, unknown>) {
	const slug = String(args.slug ?? '').trim()
	const post = allBlogs.find((item) => item.slug === slug)
	if (!post) {
		const suggestions = allBlogs
			.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
			.slice(0, 8)
			.map((item) => ({
				slug: item.slug,
				title: item.title,
				path: `/blog/${item.slug}`
			}))
		return { found: false, slug, suggestions }
	}

	return {
		found: true,
		post: {
			slug: post.slug,
			title: post.title,
			date: post.date,
			description: post.description ?? null,
			path: `/blog/${post.slug}`,
			excerpt: excerpt(post.body.raw)
		}
	}
}

async function getGithubStats() {
	const data = await getGitHubData()
	const empty =
		data.stats.followers === 0 &&
		data.stats.stars === 0 &&
		data.stats.contributions === 0

	const today = berlinDateString()
	const byDate = new Map(
		data.contributions.map((day) => [day.date, day.count] as const)
	)

	const todayCount = byDate.get(today) ?? 0
	const recentDays = Array.from({ length: 14 }, (_, index) => {
		const date = shiftIsoDate(today, -index)
		return { date, count: byDate.get(date) ?? 0 }
	})
	const lastActive = data.contributions.filter((day) => day.count > 0).at(-1)

	return {
		username: 'roberteggl',
		profileUrl: 'https://github.com/roberteggl',
		timezone: 'Europe/Berlin',
		today: {
			date: today,
			contributionCount: todayCount,
			active: todayCount > 0
		},
		recentDays,
		lastActiveDay: lastActive
			? { date: lastActive.date, contributionCount: lastActive.count }
			: null,
		stats: data.stats,
		available: !empty,
		note: empty
			? 'Live GitHub stats are unavailable right now (token missing or API empty). Still share the GitHub profile URL.'
			: 'Contribution counts are public GitHub calendar totals for that day (commits/PRs/reviews/issues across repos). They do not name which repos. Do not invent repo-level activity.'
	}
}

async function getContactAndSocials() {
	return {
		name: imprintData.contactInformation.name,
		role: PERSON_TAGLINE,
		jobTitle: PERSON_JOB_TITLE,
		site: SITE_URL,
		email: imprintData.contactInformation.email,
		socials: personSameAs,
		imprintPath: '/legal/imprint',
		privacyPath: '/legal/privacy'
	}
}

export const agentFunctionTools: FunctionTool[] = [
	{
		type: 'function',
		name: 'search_site',
		description:
			'Search Robert’s projects and blog posts by keyword (tech, title, topic). Prefer this for open-ended questions.',
		strict: true,
		parameters: {
			type: 'object',
			properties: {
				query: {
					type: 'string',
					description: 'Search keywords, e.g. "kubernetes", "neuland", "rust"'
				},
				limit: {
					type: 'number',
					description: 'Max results per type (1–12). Default 6.'
				}
			},
			required: ['query', 'limit'],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'get_project',
		description:
			'Get full details for one project by slug (e.g. neuland-next, github-deployment-bridge).',
		strict: true,
		parameters: {
			type: 'object',
			properties: {
				slug: {
					type: 'string',
					description: 'Project slug from the site URL /projects/{slug}'
				}
			},
			required: ['slug'],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'get_blog_post',
		description:
			'Get a blog post summary and short excerpt by slug (e.g. github-deployment-bridge).',
		strict: true,
		parameters: {
			type: 'object',
			properties: {
				slug: {
					type: 'string',
					description: 'Post slug from /blog/{slug}'
				}
			},
			required: ['slug'],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'get_github_stats',
		description:
			'Fetch live GitHub data for roberteggl: today’s contribution count (Europe/Berlin), last 14 days of the contribution calendar, last active day, plus followers, stars, yearly contributions, PRs, and top languages. Use for “what is he working on today / recently / GitHub activity”.',
		strict: true,
		parameters: {
			type: 'object',
			properties: {},
			required: [],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'get_contact_and_socials',
		description:
			'Return official contact email and social profile links for Robert Eggl.',
		strict: true,
		parameters: {
			type: 'object',
			properties: {},
			required: [],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'navigate_to_page',
		description:
			'Open a page on this site in the visitor’s browser (client-side navigation). Use when they ask to open, go to, show, or take them to a project, blog post, or other on-site page. Pass a site path like /projects/neuland-next — not external URLs.',
		strict: true,
		parameters: {
			type: 'object',
			properties: {
				path: {
					type: 'string',
					description:
						'Site path to open, e.g. /projects/neuland-next, /blog/some-slug, /projects, /blog, /keys, /legal/privacy. Path-only; no full localhost or eggl.dev URL.'
				}
			},
			required: ['path'],
			additionalProperties: false
		}
	},
	{
		type: 'function',
		name: 'end_chat',
		description:
			'Permanently end this chat session when abuse is clear (e.g. repeated jailbreaks, clear harmful intent after refusal, threats). Do not use for mere off-topic questions. Locks the UI so the visitor cannot continue.',
		strict: true,
		parameters: {
			type: 'object',
			properties: {
				reason: {
					type: 'string',
					description:
						'Short internal reason code, e.g. jailbreak, harmful_intent, harassment, malware_request, other_abuse'
				},
				message: {
					type: 'string',
					description:
						'Short user-facing closing line explaining the chat was ended. Keep it calm and brief.'
				}
			},
			required: ['reason', 'message'],
			additionalProperties: false
		}
	}
]

const ALLOWED_TOOLS = new Set([
	'search_site',
	'get_project',
	'get_blog_post',
	'get_github_stats',
	'get_contact_and_socials',
	'navigate_to_page',
	'end_chat'
])

const SITE_PATH_RE =
	/^\/(?:$|projects(?:\/[a-z0-9-]+)?|blog(?:\/[a-z0-9-]+)?|keys|legal\/(?:privacy|imprint))$/i

export type EndChatResult = {
	ended: true
	reason: string
	message: string
}

export type NavigateResult = {
	navigated: true
	path: string
}

export function parseEndChatResult(output: string): EndChatResult | null {
	try {
		const parsed = JSON.parse(output) as Partial<EndChatResult>
		if (parsed?.ended === true && typeof parsed.reason === 'string') {
			return {
				ended: true,
				reason: parsed.reason,
				message:
					typeof parsed.message === 'string' && parsed.message.trim()
						? parsed.message.trim()
						: 'This chat has been ended due to clear misuse.'
			}
		}
	} catch {
		// ignore
	}
	return null
}

export function parseNavigateResult(output: string): NavigateResult | null {
	try {
		const parsed = JSON.parse(output) as Partial<NavigateResult> & {
			ok?: boolean
			path?: string
		}
		if (
			parsed?.navigated === true &&
			typeof parsed.path === 'string' &&
			parsed.path.startsWith('/')
		) {
			return { navigated: true, path: parsed.path }
		}
	} catch {
		// ignore
	}
	return null
}

function endChat(args: Record<string, unknown>): EndChatResult {
	const reason = String(args.reason ?? 'other_abuse').trim() || 'other_abuse'
	const message =
		String(args.message ?? '').trim() ||
		'This chat has been ended due to clear misuse.'
	return { ended: true, reason, message }
}

/** Normalize tool input to a same-site path, or null if external / invalid. */
export function normalizeSitePath(input: string): string | null {
	const raw = input.trim()
	if (!raw) return null

	let path = raw
	if (/^https?:\/\//i.test(raw)) {
		try {
			const url = new URL(raw)
			const host = url.hostname.toLowerCase()
			const allowedHost =
				host === 'eggl.dev' ||
				host === 'www.eggl.dev' ||
				host === 'localhost' ||
				host === '127.0.0.1'
			if (!allowedHost) return null
			path = url.pathname || '/'
		} catch {
			return null
		}
	}

	if (!path.startsWith('/')) {
		path = `/${path}`
	}

	// Strip trailing slash except root
	if (path.length > 1 && path.endsWith('/')) {
		path = path.slice(0, -1)
	}

	if (path.includes('..') || path.startsWith('//') || path.includes('\\')) {
		return null
	}

	if (!SITE_PATH_RE.test(path)) {
		return null
	}

	return path
}

function navigateToPage(args: Record<string, unknown>) {
	const normalized = normalizeSitePath(String(args.path ?? ''))
	if (!normalized) {
		return {
			navigated: false,
			error:
				'Invalid or off-site path. Use a site path like /projects/neuland-next, /blog, or /keys. External URLs cannot be opened with this tool — give the user a Markdown link instead.'
		}
	}

	// Soft-check known project / post slugs when present
	const projectMatch = normalized.match(/^\/projects\/([a-z0-9-]+)$/i)
	if (projectMatch) {
		const project = getProjectBySlug(projectMatch[1])
		if (!project) {
			return {
				navigated: false,
				path: normalized,
				error: `No project at ${normalized}. Call get_project or search_site for a valid slug.`
			}
		}
	}

	const blogMatch = normalized.match(/^\/blog\/([a-z0-9-]+)$/i)
	if (blogMatch) {
		const post = allBlogs.find((item) => item.slug === blogMatch[1])
		if (!post) {
			return {
				navigated: false,
				path: normalized,
				error: `No blog post at ${normalized}. Call get_blog_post or search_site for a valid slug.`
			}
		}
	}

	return { navigated: true, path: normalized }
}

export async function executeAgentTool(
	name: string,
	args: Record<string, unknown>
): Promise<string> {
	if (!ALLOWED_TOOLS.has(name)) {
		return JSON.stringify({
			error:
				'Tool not allowed. Web search and other external tools are disabled.'
		})
	}

	try {
		let result: unknown
		switch (name) {
			case 'search_site':
				result = await searchSite(args)
				break
			case 'get_project':
				result = await getProject(args)
				break
			case 'get_blog_post':
				result = await getBlogPost(args)
				break
			case 'get_github_stats':
				result = await getGithubStats()
				break
			case 'get_contact_and_socials':
				result = await getContactAndSocials()
				break
			case 'navigate_to_page':
				result = navigateToPage(args)
				break
			case 'end_chat':
				result = endChat(args)
				break
			default:
				result = { error: `Unknown tool: ${name}` }
		}
		return JSON.stringify(result)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Tool failed'
		return JSON.stringify({ error: message })
	}
}
