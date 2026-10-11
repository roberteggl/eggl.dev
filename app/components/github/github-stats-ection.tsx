import type { GitHubData } from '@/lib/github'
import GitHubContributionCalendar from './github-contribution-calendar'
import GitHubLanguages from './github-languages'
import GitHubStatsCards from './github-stats-cards'

interface GitHubStatsSectionProps {
	githubData: GitHubData
}

const GitHubStatsSection = ({ githubData }: GitHubStatsSectionProps) => {
	const hasNoData =
		!githubData.contributions.length &&
		!githubData.stats.topLanguages.length &&
		githubData.stats.followers === 0 &&
		githubData.stats.stars === 0 &&
		githubData.stats.contributions === 0 &&
		githubData.stats.pullRequests === 0

	if (hasNoData) {
		return (
			<div className="luxe-card mx-auto max-w-lg p-10 text-center">
				<h3 className="font-display text-2xl">GitHub stats are resting</h3>
				<p className="mt-2 text-muted-foreground">
					The API didn&rsquo;t respond. Check back in a bit.
				</p>
				<a
					href="https://github.com/roberteggl"
					target="_blank"
					rel="noopener noreferrer"
					className="mt-6 inline-flex h-11 items-center bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
				>
					Visit GitHub directly
				</a>
			</div>
		)
	}

	return (
		<div>
			<GitHubStatsCards githubData={githubData} />
			<GitHubLanguages githubData={githubData} />
			<GitHubContributionCalendar githubData={githubData} />
		</div>
	)
}

export default GitHubStatsSection
