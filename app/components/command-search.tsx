'use client'

import {
	BookOpen,
	CornerDownLeft,
	FileText,
	FolderKanban,
	Home,
	KeyRound,
	Mail,
	Moon,
	Rss,
	Scale,
	Search,
	Shield,
	Sun,
	UserRound
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { type ComponentType, useEffect, useMemo, useState } from 'react'
import { Github, Linkedin } from '@/components/icons/brand-icons'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut
} from '@/components/ui/command'
import useSmoothScroll from '@/hooks/use-smooth-scroll'
import {
	getSearchIndex,
	SEARCH_GROUP_LABELS,
	SEARCH_GROUP_ORDER,
	type SearchGroup,
	type SearchItem,
	searchFilter
} from '@/lib/search-index'

type IconComponent = ComponentType<{
	className?: string
	size?: number
	strokeWidth?: number
}>

const GROUP_ICONS: Record<SearchGroup, IconComponent> = {
	pages: FileText,
	sections: UserRound,
	projects: FolderKanban,
	posts: BookOpen,
	actions: Search
}

function itemIcon(item: SearchItem, isDark: boolean) {
	if (item.action === 'theme') {
		return isDark ? Sun : Moon
	}
	if (item.id === 'action-github') return Github
	if (item.id === 'action-linkedin') return Linkedin
	if (item.id === 'action-email') return Mail
	if (item.id === 'action-rss') return Rss
	if (item.id === 'page-home') return Home
	if (item.id === 'page-keys') return KeyRound
	if (item.id === 'page-imprint') return Scale
	if (item.id === 'page-privacy') return Shield
	return GROUP_ICONS[item.group]
}

export function CommandSearch() {
	const router = useRouter()
	const pathname = usePathname()
	const { resolvedTheme, setTheme } = useTheme()
	const { handleHashLinkClick } = useSmoothScroll()
	const [open, setOpen] = useState(false)
	const items = useMemo(() => getSearchIndex(), [])
	const isDark = resolvedTheme === 'dark'

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((prev) => !prev)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	const runItem = (item: SearchItem) => {
		setOpen(false)

		if (item.action === 'theme') {
			setTheme(isDark ? 'light' : 'dark')
			return
		}

		if (item.external) {
			if (item.href.startsWith('mailto:')) {
				window.location.href = item.href
				return
			}
			window.open(item.href, '_blank', 'noopener,noreferrer')
			return
		}

		if (item.sectionId) {
			if (pathname === '/') {
				handleHashLinkClick({ preventDefault: () => undefined }, item.sectionId)
				return
			}
			router.push(item.href)
			return
		}

		router.push(item.href)
	}

	const grouped = SEARCH_GROUP_ORDER.map((group) => ({
		group,
		items: items.filter((item) => item.group === group)
	})).filter((entry) => entry.items.length > 0)

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
			title="Search eggl.dev"
			description="Jump to pages, sections, projects, and posts"
			filter={searchFilter}
		>
			<CommandInput placeholder="Search pages, sections, projects…" />
			<CommandList>
				<CommandEmpty>Nothing matched that query.</CommandEmpty>
				{grouped.map((entry) => (
					<CommandGroup
						key={entry.group}
						heading={SEARCH_GROUP_LABELS[entry.group]}
					>
						{entry.items.map((item) => {
							const Icon = itemIcon(item, isDark)
							return (
								<CommandItem
									key={item.id}
									value={item.title}
									keywords={item.keywords}
									onSelect={() => runItem(item)}
								>
									<span className="flex size-8 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface-2/70">
										<Icon size={15} strokeWidth={1.75} />
									</span>
									<span className="flex min-w-0 flex-1 flex-col gap-0.5">
										<span className="truncate font-medium">{item.title}</span>
										{item.description ? (
											<span className="truncate font-mono text-[11px] tracking-[0.04em] text-muted-foreground group-data-[selected=true]:text-accent/80">
												{item.description}
											</span>
										) : null}
									</span>
									{item.external ? <CommandShortcut>↗</CommandShortcut> : null}
								</CommandItem>
							)
						})}
					</CommandGroup>
				))}
			</CommandList>
			<div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-muted-foreground">
				<p className="font-mono text-[10px] uppercase tracking-[0.16em]">
					eggl.dev
				</p>
				<div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.08em]">
					<span className="inline-flex items-center gap-1.5">
						<kbd className="rounded-[4px] border border-line bg-surface-2 px-1.5 py-0.5">
							↑↓
						</kbd>
						navigate
					</span>
					<span className="inline-flex items-center gap-1.5">
						<kbd className="inline-flex items-center gap-0.5 rounded-[4px] border border-line bg-surface-2 px-1.5 py-0.5">
							<CornerDownLeft size={10} strokeWidth={2} />
						</kbd>
						open
					</span>
					<span className="hidden items-center gap-1.5 sm:inline-flex">
						<kbd className="rounded-[4px] border border-line bg-surface-2 px-1.5 py-0.5">
							esc
						</kbd>
						close
					</span>
				</div>
			</div>
		</CommandDialog>
	)
}

export default CommandSearch
