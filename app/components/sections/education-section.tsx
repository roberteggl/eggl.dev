'use client'
import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { type CareerEntry, careerTimeline } from '@/data/career-data'
import { Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'

function timelineIcon(entry: CareerEntry) {
	if (entry.kind === 'work') return Briefcase
	if (entry.role.startsWith('M.Sc')) return GraduationCap
	return Award
}

const EducationSection = () => {
	return (
		<section id="experience" className="relative scroll-mt-24">
			<div className="container-custom py-20 md:py-28">
				<SectionHeader
					number="03"
					eyebrow="Journey"
					title="Experience & education."
					description="From AI research to enterprise delivery."
				/>

				<Stagger className="relative space-y-10">
					{/* spine: inset so it starts/ends at the first/last dot */}
					<span
						aria-hidden="true"
						className="absolute bottom-[9px] left-[7px] top-[9px] w-px bg-line"
					/>
					{careerTimeline.map((item, i) => {
						const Icon = timelineIcon(item)
						return (
							<StaggerItem key={item.role} index={i}>
								<article className="relative pl-10 md:grid md:grid-cols-[190px_1fr] md:gap-8 md:pl-12">
									{/* dot: 15px box at left-0, center (7.5px) sits exactly on the spine */}
									<span
										aria-hidden="true"
										className={`absolute left-0 top-[4px] flex size-[15px] items-center justify-center rounded-[4px] border bg-background ${
											item.current ? 'border-accent' : 'border-line'
										}`}
									>
										<span
											className={`size-[5px] rounded-[1px] ${
												item.current ? 'bg-accent' : 'bg-line'
											}`}
										/>
									</span>
									<div>
										<p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
											{item.period}
										</p>
										{item.current ? (
											<span className="mt-2.5 inline-flex items-center rounded-[4px] border border-accent/40 bg-accent-soft px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
												Current
											</span>
										) : null}
									</div>
									<div>
										<div className="flex items-start gap-3">
											<span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface-2 text-accent sm:flex">
												<Icon size={18} strokeWidth={1.75} />
											</span>
											<div>
												<h3 className="text-xl font-semibold tracking-tight text-foreground">
													{item.role}
												</h3>
												<p className="mt-1 font-mono text-[13px] text-accent">
													{item.org}
												</p>
											</div>
										</div>
										<p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
											{item.description}
										</p>
										<ul className="mt-4 space-y-2">
											{item.points.map((point) => (
												<li
													key={point}
													className="flex items-start gap-2.5 text-[15px] text-foreground/80"
												>
													<span
														aria-hidden="true"
														className="mt-[9px] h-px w-4 shrink-0 bg-accent/60"
													/>
													{point}
												</li>
											))}
										</ul>
									</div>
								</article>
							</StaggerItem>
						)
					})}
				</Stagger>
			</div>
		</section>
	)
}

export default EducationSection
