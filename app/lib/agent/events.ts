export type ChatClientEvent =
	| {
			type: 'tool_start'
			callId: string
			name: string
			label: string
	  }
	| {
			type: 'tool_end'
			callId: string
			name: string
			ok: boolean
	  }
	| {
			type: 'text_delta'
			delta: string
	  }
	| {
			type: 'chat_ended'
			reason: string
			message: string
	  }
	| {
			type: 'navigate'
			path: string
	  }
	| {
			type: 'error'
			message: string
	  }
	| {
			type: 'done'
	  }

export const TOOL_LABELS: Record<string, string> = {
	search_site: 'Searching the site…',
	get_project: 'Opening project…',
	list_projects: 'Listing projects…',
	get_blog_post: 'Reading post…',
	list_blog_posts: 'Listing posts…',
	get_career_and_education: 'Checking career…',
	get_github_stats: 'Fetching GitHub…',
	get_contact_and_socials: 'Looking up contact…',
	navigate_to_page: 'Opening page…',
	end_chat: 'Ending chat…'
}

export function toolLabel(name: string) {
	return TOOL_LABELS[name] ?? `Running ${name}…`
}
