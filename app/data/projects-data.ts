export type ProjectCategory = 'mobile' | 'web' | 'api' | 'tool' | 'fullstack'

export interface Project {
	slug: string
	title: string
	description: string
	technologies: string[]
	github?: string
	demo?: string
	image: string
	category: ProjectCategory
	featured?: boolean
	showOnMain?: boolean
}

export const getProjectImageSrc = (image: string) =>
	image.startsWith('/') ? image : `/${image}`

export const getProjectImageUrl = (image: string) =>
	`https://eggl.dev${getProjectImageSrc(image)}`

export const PROJECT_CATEGORY_COLORS: Record<ProjectCategory, string> = {
	mobile: 'bg-blue-500/20 border-blue-500/40',
	web: 'bg-green-500/20 border-green-500/40',
	api: 'bg-purple-500/20 border-purple-500/40',
	tool: 'bg-orange-500/20 border-orange-500/40',
	fullstack: 'bg-red-500/20 border-red-500/40'
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
	mobile: 'Mobile App',
	web: 'Web App',
	api: 'API',
	tool: 'Tool',
	fullstack: 'Full Stack'
}

export const projects: Project[] = [
	{
		slug: 'neuland-next',
		title: 'Neuland Next',
		description:
			"A university app for TH Ingolstadt, built with React Native and Expo. As the project's founder and lead developer, I was responsible for the majority of the app's development. The app has about 4000 active users and is used by students to manage their courses, grades and schedules.",
		technologies: ['React Native', 'Expo', 'TypeScript', 'CI/CD'],
		github: 'https://github.com/neuland-ingolstadt/neuland.app-native',
		demo: 'https://neuland.app',
		image: '/images/neuland-next-app-light.webp',
		category: 'mobile',
		featured: true,
		showOnMain: true
	},
	{
		slug: 'github-deployment-bridge',
		title: 'GitHub Deployment Bridge',
		description:
			'A lightweight Kubernetes controller that watches Flux Kustomizations and HelmReleases and mirrors lifecycle state to the GitHub Deployments API. It resolves workload identity from OCI labels and optional annotations, authenticates as a GitHub App, and reports queued through success or failure without orchestrating deploys.',
		technologies: [
			'Go',
			'Kubernetes',
			'FluxCD',
			'Helm',
			'GitHub App',
			'Prometheus'
		],
		github: 'https://github.com/roberteggl/github-deployment-bridge',
		demo: 'https://roberteggl.github.io/github-deployment-bridge/',
		image: '/images/github-deployment-bridge.webp',
		category: 'tool',
		featured: true,
		showOnMain: true
	},
	{
		slug: 'digital-member-id',
		title: 'Digital Member ID',
		description:
			'A modern, full-stack member identification system with QR code generation, verification, and Apple Wallet integration. It provides a comprehensive digital identity solution that combines modern web technologies with cryptographic security, offering secure QR generation, real-time verification, Apple Wallet integration, and a dashboard for tracking scan history and statistics.',
		technologies: ['Rust', 'Next.js', 'TypeScript', 'Apple Wallet', 'QR Codes'],
		github: 'https://github.com/neuland-ingolstadt/member-id',
		demo: 'https://id.informatik.sexy',
		image: '/images/member-id.webp',
		category: 'fullstack',
		featured: true,
		showOnMain: true
	},
	{
		slug: 'campus-life-events',
		title: 'Campus Life Events',
		description:
			'A fullstack web application for managing and displaying campus events at TH Ingolstadt. Built with Rust, Redis and Next.js, it allows university clubs to create and manage events, while students can browse them in Neuland Next app.',
		technologies: ['Rust', 'Next.js', 'Redis', 'TypeScript'],
		github: 'https://github.com/neuland-ingolstadt/campus-life-events',
		demo: 'https://cl.neuland.ing',
		image: '/images/cle.webp',
		category: 'fullstack',
		showOnMain: false
	},
	{
		slug: 'neuland-connect',
		title: 'Neuland Connect',
		description:
			'A self-service member portal for Neuland Ingolstadt that bridges Authentik and GitHub organization management. Members sign in via OIDC, link their GitHub account from a dashboard, and a GitHub App automatically sends org invites and reconciles membership on a schedule - keeping the organization in sync with club members without a local user database or GitHub Enterprise SSO.',
		technologies: [
			'TanStack Start',
			'React',
			'TypeScript',
			'Authentik',
			'GitHub API'
		],
		github: 'https://github.com/neuland-ingolstadt/neuland-connect',
		demo: 'https://connect.neuland.ing',
		image: '/images/neuland-connect.webp',
		category: 'fullstack',
		showOnMain: false
	},
	{
		slug: 'trajectory-trace',
		title: 'Trajectory Trace',
		description:
			"At e:fs TechHub, I contributed to the development of Trajectory Trace, a cutting-edge platform for realtime traffic data processing and analysis. My work focused on enhancing the system's scalability and performance in both Rust backend and Next.js frontend.",
		technologies: ['Rust', 'Next.js', 'TypeScript', 'MQTT', 'Kafka'],
		image: '/images/tt.webp',
		demo: 'https://city.dev.sdk-cloud.de/',
		category: 'fullstack',
		showOnMain: false
	},
	{
		slug: 'neuland-kubernetes',
		title: 'Neuland Kubernetes',
		description:
			'Built and manage the self-hosted K3s infrastructure for Neuland services using GitOps principles. The infrastructure handles deployment automation, monitoring, and scaling for all Neuland applications, ensuring high availability and efficient resource management.',
		technologies: [
			'Kubernetes',
			'K3s',
			'GitOps',
			'FluxCD',
			'Docker',
			'Infrastructure'
		],
		github: 'https://github.com/neuland-ingolstadt/flux-infra',
		image: '/images/k3s.webp',
		category: 'tool',
		showOnMain: false
	},
	{
		slug: 'neuland-website',
		title: 'Neuland Website',
		description:
			'The main landing page for the Neuland club, built with Next.js and Tailwind CSS. It serves as a showcase for our projects and provides information about the club and its events. I utilized a retro terminal style to effectively present our values, incorporating hidden features to enhance its appeal.',
		technologies: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Analytics'],
		github: 'https://github.com/neuland-ingolstadt/neuland-website',
		demo: 'https://neuland-ingolstadt.de',
		image: '/images/neuland-website.webp',
		category: 'web',
		showOnMain: false
	},
	{
		slug: 'eggl-cli',
		title: 'eggl-cli',
		description:
			'My general-purpose helper CLI built with Go and Cobra. Distributed via Homebrew and GitHub Releases, with shell completions for bash, zsh, and fish. A small toolbox of commands I reach for across homelab, dev, and day-to-day workflows.',
		technologies: ['Go', 'Cobra', 'CLI', 'Homebrew'],
		github: 'https://github.com/roberteggl/eggl-cli',
		image: '/images/eggl-cli.webp',
		category: 'tool',
		showOnMain: false
	},
	{
		slug: 'expo-github-cache',
		title: 'Expo GitHub Cache',
		description:
			"A plugin that dramatically speeds up mobile app development by caching build files in GitHub Releases. Instead of waiting for full compilation every time, it reuses previously built versions when your code hasn't changed, saving significant development time.",
		technologies: [
			'TypeScript',
			'Expo',
			'GitHub API',
			'Build Caching',
			'NPM Package'
		],
		github: 'https://github.com/roberteggl/expo-github-cache',
		demo: 'https://www.npmjs.com/package/@eggl-js/expo-github-cache',
		image: '/images/cache.webp',
		category: 'tool',
		showOnMain: false
	},
	{
		slug: 'neuland-api',
		title: 'Neuland API',
		description:
			'A GraphQL API for the Neuland apps and services, built with Node.js and Apollo Server. It provides a unified interface for accessing data from various sources, like the meal plan, campus events and more.',
		technologies: ['Node.js', 'Apollo Server', 'GraphQL', 'PostgreSQL'],
		github: 'https://github.com/neuland-ingolstadt/neuland.app-backend',
		demo: 'https://api.neuland.app',
		image: '/images/backend.png',
		category: 'api',
		showOnMain: false
	},
	{
		slug: 'personal-website',
		title: 'Personal Website',
		description:
			'This personal portfolio website built with Next.js, featuring a modern neo-brutalist design with smooth animations and interactive elements. The site showcases my projects, skills, and experience in an engaging way.',
		technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
		demo: 'https://eggl.dev',
		github: 'https://github.com/roberteggl/eggl.dev',
		image: '/images/personal.webp',
		category: 'web',
		showOnMain: false
	},
	{
		slug: 'neuland-app-website',
		title: 'Neuland App Website',
		description:
			'The landing page and documentation for the Neuland Next app, built with Next.js and Tailwind CSS. It serves as a showcase for the app and provides information about the app and its features.',
		technologies: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Nextra'],
		github: 'https://github.com/neuland-ingolstadt/neuland.app-docs',
		demo: 'https://neuland.app',
		image: '/images/next-docs.webp',
		category: 'web',
		showOnMain: false
	},
	{
		slug: 'trajectory-trace-product-page',
		title: 'Trajectory Trace Product Page',
		description:
			'At e:fs TechHub, I developed the product page for Trajectory Trace, showcasing its features and benefits. It combines a Docusaurus-powered documentation site with a custom React frontpage, delivering a seamless user experience.',
		technologies: ['React', 'Docusaurus', 'TypeScript', 'CSS'],
		demo: 'https://city.dev.sdk-cloud.de/docs/',
		image: '/images/ttd.webp',
		category: 'web',
		showOnMain: false
	},
	{
		slug: 'home-assistant-integration',
		title: 'Home Assistant Integration',
		description:
			'To quickly retrieve the current meal plans of the TH Ingolstadt canteens, I developed a Home Assistant integration that fetches data from the Neuland API and exposes it via sensors. The integration also allows customization of locations and price groups.',
		technologies: ['Home Assistant', 'Python', 'GraphQL'],
		image: '/images/ha.webp',
		github: 'https://github.com/roberteggl/hacs-thi-mensa',
		category: 'tool',
		showOnMain: false
	},
	{
		slug: 'papra-email-proxy',
		title: 'Papra Email Proxy',
		description:
			'A production-ready fork of the official Papra email proxy - battle-tested with CI, tests, and first-class Cloudflare Zero Trust (Access) support. Forwards inbound email to your self-hosted Papra instance via Cloudflare Email Workers, with service-token auth so webhook calls work even when Papra sits behind Access.',
		technologies: [
			'TypeScript',
			'Cloudflare Workers',
			'Email Routing',
			'Zero Trust'
		],
		github: 'https://github.com/roberteggl/papra-email-proxy',
		image: '/images/papra-email-proxy.webp',
		category: 'tool',
		showOnMain: false
	},
	{
		slug: 'alertmanager-mqtt-bridge',
		title: 'Alertmanager MQTT Bridge',
		description:
			'A lightweight Go microservice that accepts Prometheus Alertmanager webhook v2 payloads and publishes retained MQTT status messages reflecting the highest active alert severity. Built for homelab observability stacks where you want alert state available to MQTT subscribers and automations.',
		technologies: ['Go', 'Alertmanager', 'MQTT', 'Prometheus', 'Nix'],
		github: 'https://github.com/roberteggl/Alertmanager-Webhook-MQTT-Bridge',
		image: '/images/alertmanager-mqtt-bridge.webp',
		category: 'tool',
		showOnMain: false
	}
]

export const getProjectPath = (project: Pick<Project, 'slug'>) =>
	`/projects/${project.slug}`

export const getProjectBySlug = (slug: string) =>
	projects.find((project) => project.slug === slug)

export const getRelatedProjects = (project: Project, limit = 3) =>
	projects
		.filter(
			(candidate) =>
				candidate.slug !== project.slug &&
				candidate.category === project.category
		)
		.slice(0, limit)

export const getMainPageProjects = () => {
	return projects.filter((project) => project.showOnMain === true)
}

export const getFeaturedProjects = () => {
	return projects.filter((project) => project.featured === true)
}

export const getAllProjects = () => {
	return projects
}
