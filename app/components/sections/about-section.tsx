'use client'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'

const FOCUS_AREAS = [
	{
		index: '01',
		title: 'Enterprise',
		description: 'Fullstack delivery and process consulting at SAP.'
	},
	{
		index: '02',
		title: 'Open source',
		description: 'Campus apps and tools used by thousands of students.'
	},
	{
		index: '03',
		title: 'Cloud & AI',
		description: 'M.Sc. Cloud & Security. B.Sc. Artificial Intelligence.'
	}
] as const

const STACK = [
	'TypeScript',
	'React',
	'Next.js',
	'Rust',
	'Go',
	'Kubernetes',
	'SAP CAP',
	'PyTorch'
]

const AboutSection = () => {
	return (
		<section id="about" className="relative scroll-mt-24 overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_50%,rgba(45,212,191,0.05),transparent_60%)]"
			/>
			<div className="container-custom relative py-20 md:py-28">
				<SectionHeader
					number="02"
					eyebrow="About"
					title="Developer & consultant."
					description="Fullstack at SAP. Background in cloud, security, and AI, plus open source that people rely on."
				/>

				<div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
					<Reveal>
						<div className="space-y-5 text-[17px] leading-[1.8] text-foreground/85">
							<p>
								I build and ship systems at{' '}
								<span className="font-medium text-foreground">SAP</span> as a
								Fullstack Developer and Business Process Consultant, bridging
								architecture, delivery, and the processes they serve.
							</p>
							<p className="text-muted-foreground">
								Outside of that, I maintain open-source campus software,
								including the Neuland Campus App used by thousands of students
								at TH Ingolstadt.
							</p>
						</div>

						<div className="mt-8 flex flex-wrap gap-2">
							{STACK.map((item) => (
								<span
									key={item}
									className="rounded-[2px] border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
								>
									{item}
								</span>
							))}
						</div>

						<Link
							href="/projects"
							className="group mt-10 inline-flex items-center gap-2 border-b border-accent/40 pb-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
						>
							See selected projects
							<ArrowUpRight
								size={15}
								className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</Link>
					</Reveal>

					<Stagger className="divide-y divide-line border-y border-line">
						{FOCUS_AREAS.map((area, i) => (
							<StaggerItem key={area.index} index={i}>
								<div className="group relative flex gap-5 py-6 transition-all duration-200 hover:pl-2">
									<span
										aria-hidden="true"
										className="absolute bottom-0 left-0 top-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
									/>
									<span className="pt-1 font-mono text-[11px] text-accent">
										{area.index}
									</span>
									<div>
										<h3 className="text-lg font-medium tracking-tight text-foreground">
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
