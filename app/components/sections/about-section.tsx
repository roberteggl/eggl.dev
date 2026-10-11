'use client'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'

const FOCUS_AREAS = [
	{
		index: '01',
		title: 'Enterprise Software',
		description:
			'Fullstack solutions at SAP with modern architectures and cloud-native technologies.'
	},
	{
		index: '02',
		title: 'Business Consulting',
		description:
			'Bridging business processes and technology, from requirement to rollout.'
	},
	{
		index: '03',
		title: 'Cloud & AI',
		description:
			'M.Sc. in Cloud Applications & Security Engineering, B.Sc. in Artificial Intelligence.'
	},
	{
		index: '04',
		title: 'Open Source',
		description:
			'Maintainer and contributor, including the Neuland Campus App used by thousands.'
	}
]

const AboutSection = () => {
	return (
		<section id="about" className="relative scroll-mt-24 overflow-hidden">
			<div className="container-custom py-20 md:py-28">
				<SectionHeader
					number="01"
					eyebrow="About"
					title="Developer & consultant."
					description="Fullstack Developer and Business Process Consultant @ SAP. M.Sc. Cloud Applications & Security Engineering, B.Sc. Artificial Intelligence."
				/>

				<div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
					<Reveal>
						<div className="space-y-5 text-[17px] leading-[1.8] text-foreground/85">
							<p>
								Fullstack Developer and Business Process Consultant at{' '}
								<span className="font-medium text-foreground">SAP</span>, with a
								background in cloud engineering, AI, and enterprise software.
							</p>
							<p>
								I hold an M.Sc. in Cloud Applications and Security Engineering
								and a B.Sc. in Artificial Intelligence from Technische
								Hochschule Ingolstadt.
							</p>
							<p className="text-muted-foreground">
								Beyond my professional role, I&rsquo;m an active open-source
								contributor and helped build the Neuland Campus App, used by
								thousands of students.
							</p>
						</div>
						<Link
							href="/projects"
							className="group mt-8 inline-flex items-center gap-2 border-b border-accent/40 pb-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
						>
							See selected projects
							<ArrowUpRight
								size={15}
								className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</Link>
					</Reveal>

					<Stagger className="divide-y divide-line border-y border-line">
						{FOCUS_AREAS.map((area) => (
							<StaggerItem key={area.index}>
								<div className="group relative flex gap-5 py-6 pl-0 transition-all duration-200 hover:pl-3">
									<span
										aria-hidden="true"
										className="absolute bottom-0 left-0 top-0 w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
									/>
									<span className="pt-1.5 font-mono text-xs text-accent">
										{area.index}
									</span>
									<div>
										<h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
											{area.title}
										</h3>
										<p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
											{area.description}
										</p>
									</div>
								</div>
							</StaggerItem>
						))}
					</Stagger>
				</div>
			</div>
		</section>
	)
}

export default AboutSection
