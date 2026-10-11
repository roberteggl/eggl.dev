'use client'
import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'

const TIMELINE = [
	{
		period: '03/2026 to Present',
		role: 'Fullstack Developer & Business Process Consultant',
		org: 'SAP · Service & Delivery',
		description:
			'Building enterprise fullstack solutions and consulting on business processes, with a focus on cloud-native development and AI.',
		points: [
			'Fullstack development for enterprise software and service delivery',
			'Business process consulting bridging technology and customer needs'
		],
		icon: Briefcase,
		current: true
	},
	{
		period: '10/2024 to 06/2026',
		role: 'M.Sc. Cloud Applications & Security Engineering',
		org: 'Technische Hochschule Ingolstadt',
		description:
			'Specialized in Security Engineering, Cloud-Native Development, and industry projects. Master thesis on simulation-based optimization at MBDA Deutschland.',
		points: [
			'Security Engineering, Computer Forensics, Network Security',
			'Software Architectures, Virtualization, CI/CD, Orchestration'
		],
		icon: GraduationCap,
		current: false
	},
	{
		period: '10/2020 to 09/2024',
		role: 'B.Sc. Artificial Intelligence',
		org: 'Technische Hochschule Ingolstadt',
		description:
			'Machine learning, neural networks, and language/image processing with ethical considerations.',
		points: [
			'Bachelor thesis: RTK-GNSS for RL-based UAV path planning',
			'Project: LiDAR sensor analysis with Continental'
		],
		icon: Award,
		current: false
	}
]

const EducationSection = () => {
	return (
		<section id="experience" className="relative scroll-mt-24">
			<div className="container-custom py-20 md:py-28">
				<SectionHeader
					number="04"
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
					{TIMELINE.map((item) => (
						<StaggerItem key={item.role}>
							<article className="relative pl-10 md:grid md:grid-cols-[190px_1fr] md:gap-8 md:pl-12">
								{/* dot: 15px box at left-0, center (7.5px) sits exactly on the spine */}
								<span
									aria-hidden="true"
									className={`absolute left-0 top-[4px] flex size-[15px] items-center justify-center border bg-background transition-colors duration-300 ${
										item.current
											? 'border-accent'
											: 'border-line group-hover:border-accent'
									}`}
								>
									<span
										className={`size-[5px] transition-colors duration-300 ${
											item.current ? 'bg-accent' : 'bg-line'
										}`}
									/>
								</span>
								<div>
									<p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
										{item.period}
									</p>
									{item.current ? (
										<span className="mt-2.5 inline-flex items-center border border-accent/40 bg-accent-soft px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
											Current
										</span>
									) : null}
								</div>
								<div>
									<div className="flex items-start gap-3">
										<span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center border border-line bg-surface-2 text-accent sm:flex">
											<item.icon size={18} strokeWidth={1.75} />
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
					))}
				</Stagger>
			</div>
		</section>
	)
}

export default EducationSection
