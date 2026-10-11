'use client'
import { Code2, Layers, Wrench } from 'lucide-react'
import { Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'
import SignalField from '../signal-field'

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
		<SignalField
			id="skills"
			mesh="circles"
			contentClassName="container-custom relative z-10 py-20 md:py-28"
		>
			<SectionHeader
				number="02"
				eyebrow="Skills"
				title="What I work with."
				description="The tools I use to ship and run software."
				invert
			/>

			<Stagger className="grid gap-5 md:grid-cols-3">
				{CATEGORIES.map((cat) => (
					<StaggerItem key={cat.label}>
						<div className="h-full border border-black/10 bg-white/80 p-7 text-[#0e1217] shadow-[0_1px_0_rgba(14,18,23,0.06)] backdrop-blur-sm transition-colors duration-150 hover:bg-white/90 dark:border-white/15 dark:bg-[#0b0d10]/75 dark:text-[#e8edf2] dark:shadow-none dark:hover:bg-[#0b0d10]/85 md:p-8">
							<div className="flex items-center gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none border border-[#0f766e]/35 bg-[#0f766e]/10 text-[#0f766e] dark:border-[#2dd4bf]/40 dark:bg-[#2dd4bf]/15 dark:text-[#2dd4bf]">
									<cat.icon size={20} strokeWidth={1.75} />
								</div>
								<div>
									<h3 className="text-lg font-semibold tracking-tight">
										{cat.label}
									</h3>
									<p className="text-sm text-[#0e1217]/60 dark:text-[#e8edf2]/60">
										{cat.description}
									</p>
								</div>
							</div>
							<div className="mt-6 flex flex-wrap gap-2">
								{cat.skills.map((skill) => (
									<span
										key={skill}
										className="rounded-[2px] border border-black/12 bg-[#0e1217]/[0.04] px-2.5 py-1 font-mono text-[12px] text-[#0e1217]/85 transition-colors duration-150 hover:border-[#0f766e] hover:text-[#0f766e] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#e8edf2]/85 dark:hover:border-[#2dd4bf] dark:hover:text-[#2dd4bf]"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					</StaggerItem>
				))}
			</Stagger>
		</SignalField>
	)
}

export default SkillsSection
