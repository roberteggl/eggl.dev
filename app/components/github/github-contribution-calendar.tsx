'use client'
import { GitBranch } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { formatDate, type GitHubData, getContributionColor } from '@/lib/github'

interface GitHubContributionCalendarProps {
	githubData: GitHubData
}

const GitHubContributionCalendar = ({
	githubData
}: GitHubContributionCalendarProps) => {
	if (githubData.contributions.length === 0) return null

	const firstDate = new Date(githubData.contributions[0].date)
	const lastDate = new Date(
		githubData.contributions[githubData.contributions.length - 1].date
	)
	const range = `${firstDate.toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	})} – ${lastDate.toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric'
	})}`
	const weekCount = Math.ceil(githubData.contributions.length / 7)

	return (
		<div className="mt-6">
			<h4 className="mb-3 flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
				<GitBranch size={16} className="mr-2 text-accent" />
				Contribution Calendar
			</h4>

			<div className="luxe-card inline-block overflow-hidden p-4 md:p-5">
				<p className="mb-3 font-mono text-[13px] text-muted-foreground">
					{range}
				</p>

				<div className="flex">
					<div className="w-10 flex-shrink-0">
						<div className="h-4" />
						{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
							<div
								key={day}
								className="mt-1 h-3 pr-2 text-right font-mono text-[11px] text-muted-foreground"
							>
								{day}
							</div>
						))}
					</div>

					<div className="max-w-[calc(100vw-160px)] overflow-x-auto pb-2">
						<div className="flex flex-col">
							<div className="flex h-4 gap-1">
								{Array.from({ length: weekCount }).map((_, i) => (
									<div
										key={`week-spacer-${i}`}
										className="h-3 w-3 flex-shrink-0"
									/>
								))}
							</div>

							{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
								(day, dayIndex) => (
									<div key={day} className="mt-1 flex w-max gap-1">
										{Array.from({ length: weekCount }).map((_, weekIndex) => {
											const contribIndex = weekIndex * 7 + dayIndex
											const contribution =
												contribIndex < githubData.contributions.length
													? githubData.contributions[contribIndex]
													: null

											if (!contribution) {
												return (
													<div
														key={`empty-${dayIndex}-${weekIndex}`}
														className="h-3 w-3"
													/>
												)
											}

											return (
												<TooltipProvider
													key={contribution.date}
													delayDuration={0}
												>
													<Tooltip>
														<TooltipTrigger asChild>
															<div
																className={`h-3 w-3 flex-shrink-0 cursor-pointer rounded-[3px] border border-line/50 ${getContributionColor(contribution.count)}`}
															/>
														</TooltipTrigger>
														<TooltipContent side="top">
															<span className="font-mono text-xs">
																{formatDate(contribution.date)}:{' '}
																{contribution.count} contribution
																{contribution.count === 1 ? '' : 's'}
															</span>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											)
										})}
									</div>
								)
							)}
						</div>
					</div>
				</div>

				<div className="mt-5 flex items-center justify-end gap-2 font-mono text-[11px] text-muted-foreground">
					<span className="mr-1">Less</span>
					<div className="h-3 w-3 border border-line/50 bg-neutral-800" />
					<div className="h-3 w-3 border border-line/50 bg-accent/30" />
					<div className="h-3 w-3 border border-line/50 bg-accent/60" />
					<div className="h-3 w-3 border border-line/50 bg-accent/85" />
					<div className="h-3 w-3 border border-line/50 bg-accent" />
					<span className="ml-1">More</span>
				</div>
			</div>
		</div>
	)
}

export default GitHubContributionCalendar
