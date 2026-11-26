export type CareerKind = 'work' | 'education'

export type CareerEntry = {
	period: string
	role: string
	org: string
	description: string
	points: string[]
	kind: CareerKind
	current: boolean
}

/** Experience & education timeline shown on the homepage Journey section. */
export const careerTimeline: CareerEntry[] = [
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
		kind: 'work',
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
		kind: 'education',
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
		kind: 'education',
		current: false
	}
]

export const getCareerTimeline = () => careerTimeline

export const getCurrentRole = () =>
	careerTimeline.find((entry) => entry.current) ?? null
