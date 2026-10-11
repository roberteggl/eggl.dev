'use client'
import { Code2, Layers, Wrench } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'

const CATEGORIES = [
	{
		icon: Code2,
		label: 'Languages',
		description: 'Frontend, backend, and data.',
		skills: ['TypeScript', 'Python', 'Java', 'SQL', 'Rust', 'Go']
	},
	{
		icon: Layers,
		label: 'Frameworks & Platforms',
		description: 'Apps, APIs, and machine learning.',
		skills: [
			'React',
			'Next.js',
			'React Native',
			'SAP CAP',
			'Fiori',
			'GraphQL & REST',
			'(No)SQL Databases',
			'PyTorch'
		]
	},
	{
		icon: Wrench,
		label: 'Tools & Delivery',
		description: 'DevOps and cloud workflows.',
		skills: [
			'Git & CI/CD',
			'Docker',
			'Kubernetes',
			'Cloud Platforms',
			'Linux',
			'Observability'
		]
	}
]

const SkillsSection = () => {
	return (
		<section id="skills" className="relative scroll-mt-24">
			<div className="container-custom py-20 md:py-28">
				<SectionHeader
					number="02"
					eyebrow="Skills"
					title="What I work with."
					description="The tools I use to ship and run software."
				/>

				<Stagger className="grid gap-5 md:grid-cols-3">
					{CATEGORIES.map((cat) => (
						<StaggerItem key={cat.label}>
							<div className="signal-card signal-card-hover h-full p-7 md:p-8">
								<div className="flex items-center gap-4">
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none border border-line bg-surface-2 text-accent">
										<cat.icon size={20} strokeWidth={1.75} />
									</div>
									<div>
										<h3 className="text-lg font-semibold tracking-tight">
											{cat.label}
										</h3>
										<p className="text-sm text-muted-foreground">
											{cat.description}
										</p>
									</div>
								</div>
								<div className="mt-6 flex flex-wrap gap-2">
									{cat.skills.map((skill) => (
										<span
											key={skill}
											className="rounded-[2px] border border-line bg-surface/60 px-2.5 py-1 font-mono text-[12px] text-foreground/85 transition-colors duration-200 hover:border-accent hover:text-accent"
										>
											{skill}
										</span>
									))}
								</div>
							</div>
						</StaggerItem>
					))}
				</Stagger>

				<Reveal delay={0.1} className="mt-8">
					<div className="flex flex-wrap items-center gap-2.5">
						{[
							'SAP BTP',
							'ABAP',
							'Open Source',
							'Technical Writing',
							'Mentoring'
						].map((tag) => (
							<span key={tag} className="signal-chip">
								{tag}
							</span>
						))}
					</div>
				</Reveal>
			</div>
		</section>
	)
}

export default SkillsSection
