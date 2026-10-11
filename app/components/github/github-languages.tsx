import { Code } from 'lucide-react'
import type { GitHubData } from '@/lib/github'

interface GitHubLanguagesProps {
	githubData: GitHubData
}

const GitHubLanguages = ({ githubData }: GitHubLanguagesProps) => {
	if (githubData.stats.topLanguages.length === 0) return null
	return (
		<div className="mt-6">
			<h4 className="mb-3 flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
				<Code size={16} className="mr-2 text-accent" />
				Top Languages
			</h4>

			<div className="flex flex-wrap gap-2.5">
				{githubData.stats.topLanguages.map((language) => (
					<span key={language} className="luxe-chip">
						{language}
					</span>
				))}
			</div>
		</div>
	)
}

export default GitHubLanguages
