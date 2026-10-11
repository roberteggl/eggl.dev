import { Code, GitBranch, GitPullRequest, Star, Users } from 'lucide-react'
import type { GitHubData } from '@/lib/github'

interface GitHubStatsCardsProps {
	githubData: GitHubData
}

const GitHubStatsCards = ({ githubData }: GitHubStatsCardsProps) => {
	const statsCards = [
		{
			icon: GitBranch,
			value: githubData.stats.contributions.toLocaleString(),
			title: 'Contributions'
		},
		{
			icon: GitPullRequest,
			value: githubData.stats.pullRequests.toLocaleString(),
			title: 'Pull Requests'
		},
		{
			icon: Users,
			value: githubData.stats.followers.toLocaleString(),
			title: 'Followers'
		},
		{
			icon: Star,
			value: githubData.stats.stars.toLocaleString(),
			title: 'Stars'
		}
	]

	return (
		<div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
			{statsCards.map((card) => (
				<div
					key={card.title}
					className="luxe-card flex items-center gap-3 px-3.5 py-3 md:px-4"
				>
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-line bg-surface-2 text-accent">
						<card.icon size={15} strokeWidth={1.75} />
					</span>
					<span className="min-w-0">
						<span className="block font-display text-xl tracking-tight text-foreground tabular-nums md:text-2xl">
							{card.value}
						</span>
						<span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
							{card.title}
						</span>
					</span>
				</div>
			))}
		</div>
	)
}

export default GitHubStatsCards

export function CodeIcon() {
	return <Code size={19} strokeWidth={1.75} className="text-accent" />
}
