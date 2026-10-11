'use client'
import { useEffect, useState } from 'react'
import type { GitHubData } from '@/lib/github'
import GitHubStatsSection from '../github/github-stats-ection'
import { Reveal } from '../reveal'
import SectionHeader from '../section-header'
import SignalField from '../signal-field'

const emptyData: GitHubData = {
	contributions: [],
	stats: {
		followers: 0,
		stars: 0,
		contributions: 0,
		pullRequests: 0,
		topLanguages: []
	}
}

const LoadingState = () => (
	<output aria-busy="true" className="block">
		<div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="luxe-card flex animate-pulse items-center gap-3 px-3.5 py-3"
				>
					<div className="h-8 w-8 shrink-0 rounded-none bg-line/70" />
					<div className="min-w-0 flex-1 space-y-1.5">
						<div className="h-5 w-14 rounded-none bg-line/70" />
						<div className="h-3 w-20 rounded-none bg-line/60" />
					</div>
				</div>
			))}
		</div>
		<div className="luxe-card mt-6 animate-pulse p-5">
			<div className="h-32 rounded-none bg-line/50" />
		</div>
	</output>
)

const CareerSection = () => {
	const [githubData, setGitHubData] = useState<GitHubData>(emptyData)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch('/api/github')
				if (res.ok) {
					const data: GitHubData = await res.json()
					setGitHubData(data)
				}
			} catch (error) {
				console.error('Failed to fetch GitHub data', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<SignalField id="activity">
			<SectionHeader
				number="05"
				eyebrow="Activity"
				title="GitHub activity."
				description="Contributions, languages, commit history, live from GitHub."
				invert
				mbSize="mb-8 md:mb-10"
			/>
			<div className="[&_h4]:text-accent-foreground/75 [&_h4_.text-accent]:text-accent-foreground [&_.luxe-chip]:border-accent-foreground/25 [&_.luxe-chip]:bg-accent-foreground/10 [&_.luxe-chip]:text-accent-foreground">
				<Reveal>
					{isLoading ? (
						<LoadingState />
					) : (
						<GitHubStatsSection githubData={githubData} />
					)}
				</Reveal>
			</div>
		</SignalField>
	)
}

export default CareerSection
