'use client'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import {
	getFeaturedProjects,
	getProjectImageSrc,
	getProjectPath,
	type Project
} from '@/data/projects-data'
import { Github } from '../icons/brand-icons'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'
import { Button } from '../ui/button'

const FeaturedProject = memo(({ project }: { project: Project }) => {
	return (
		<Reveal y={16} className="mt-12 md:mt-16">
			<Link
				href={getProjectPath(project)}
				className="group relative block overflow-hidden border border-line bg-surface"
			>
				<div className="relative aspect-[16/10] md:aspect-[21/9]">
					<Image
						src={getProjectImageSrc(project.image)}
						alt={`${project.title} project screenshot`}
						fill
						priority
						sizes="(max-width: 768px) 100vw, 1152px"
						className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent dark:from-background dark:via-background/70"
					/>
				</div>

				<div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
					<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
						Featured · {project.category}
					</p>
					<h3 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl">
						{project.title}
					</h3>
					<p className="mt-3 max-w-xl text-[15px] leading-relaxed text-foreground/75 md:text-base">
						{project.description}
					</p>
					<span className="mt-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em] text-foreground transition-colors group-hover:text-accent">
						View case
						<ArrowUpRight
							size={15}
							className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</span>
				</div>
			</Link>
		</Reveal>
	)
})

FeaturedProject.displayName = 'FeaturedProject'

const ProjectRow = memo(({ project }: { project: Project }) => {
	return (
		<Link
			href={getProjectPath(project)}
			className="soft-target group grid gap-6 border-t border-line py-8 transition-colors duration-300 last:border-b hover:bg-surface/40 md:grid-cols-[1fr_200px] md:gap-10 md:px-5 lg:grid-cols-[88px_1fr_220px] lg:items-center"
		>
			<span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:block">
				{project.category}
			</span>
			<span>
				<span className="font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-accent md:text-[26px]">
					{project.title}
				</span>
				<span className="mt-2 line-clamp-2 block max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
					{project.description}
				</span>
				<span className="mt-4 flex flex-wrap gap-2">
					{project.technologies.slice(0, 4).map((tech) => (
						<span
							key={tech}
							className="rounded-[2px] border border-line px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
						>
							{tech}
						</span>
					))}
				</span>
			</span>
			<span className="relative hidden overflow-hidden border border-line md:block">
				<Image
					src={getProjectImageSrc(project.image)}
					alt={`${project.title} project screenshot`}
					className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
					loading="lazy"
					width={440}
					height={275}
				/>
			</span>
		</Link>
	)
})

ProjectRow.displayName = 'ProjectRow'

const ProjectsSection = () => {
	const featuredProjects = getFeaturedProjects()
	const lead = featuredProjects[0]
	const rest = featuredProjects.slice(1, 4)

	if (!lead) return null

	return (
		<section id="projects" className="relative scroll-mt-24">
			<div className="container-custom py-20 md:py-28">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<SectionHeader
						number="01"
						eyebrow="Work"
						title="Selected projects."
						description="Shipped and in use — campus apps, open-source tooling, enterprise platforms."
						mbSize="mb-0"
						className="min-w-[260px] flex-1"
					/>
					<Reveal delay={0.12} className="pb-1">
						<Link
							href="/projects"
							className="group inline-flex items-center gap-2 border-b border-accent/40 pb-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
						>
							All projects
							<ArrowRight
								size={15}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</Link>
					</Reveal>
				</div>

				<FeaturedProject project={lead} />

				{rest.length > 0 ? (
					<Stagger className="mt-4">
						{rest.map((project, i) => (
							<StaggerItem key={project.slug} index={i}>
								<ProjectRow project={project} />
							</StaggerItem>
						))}
					</Stagger>
				) : null}

				<Reveal className="mt-12 flex flex-wrap items-center gap-4">
					<Button asChild size="lg" className="group">
						<Link href="/projects">
							View all projects
							<ArrowRight
								size={17}
								className="transition-transform duration-300 group-hover:translate-x-1"
							/>
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<a
							href="https://github.com/roberteggl"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github size={17} strokeWidth={1.75} />
							GitHub
						</a>
					</Button>
				</Reveal>
			</div>
		</section>
	)
}

export default ProjectsSection
