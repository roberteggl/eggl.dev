'use client'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import {
	getFeaturedProjects,
	getProjectImageSrc,
	getProjectPath,
	type Project
} from '@/data/projects-data'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'
import { Button } from '../ui/button'

const ProjectRow = memo(({ project }: { project: Project }) => {
	return (
		<Link
			href={getProjectPath(project)}
			className="group grid gap-6 border-t border-line py-8 transition-all duration-300 last:border-b hover:bg-surface/50 md:grid-cols-[1fr_220px] md:gap-10 md:px-6 lg:grid-cols-[80px_1fr_240px] lg:items-center"
		>
			<span className="hidden font-mono text-xs text-muted-foreground lg:block">
				{project.category.toUpperCase()}
			</span>
			<span>
				<span className="flex flex-wrap items-center gap-3">
					<span className="font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-accent md:text-[28px]">
						{project.title}
					</span>
					{project.featured ? (
						<span className="inline-flex items-center border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
							Featured
						</span>
					) : null}
				</span>
				<span className="mt-2.5 line-clamp-2 block max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
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
			<span className="relative hidden overflow-hidden rounded-none border border-line md:block">
				<Image
					src={getProjectImageSrc(project.image)}
					alt={`${project.title} project screenshot`}
					className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
					loading="lazy"
					width={480}
					height={300}
				/>
				<span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-none border border-line bg-background text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<ArrowUpRight size={17} />
				</span>
			</span>
		</Link>
	)
})

ProjectRow.displayName = 'ProjectRow'

const ProjectsSection = () => {
	const featuredProjects = getFeaturedProjects().slice(0, 5)

	return (
		<section id="projects" className="relative scroll-mt-24">
			<div className="container-custom py-20 md:py-28">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<SectionHeader
						number="03"
						eyebrow="Projects"
						title="Selected projects."
						description="Shipped and in use: enterprise platforms, campus apps, open-source tooling."
						mbSize="mb-0"
						className="flex-1 min-w-[260px]"
					/>
					<Reveal delay={0.15} className="pb-1">
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

				<Stagger className="mt-12">
					{featuredProjects.map((project) => (
						<StaggerItem key={project.slug}>
							<ProjectRow project={project} />
						</StaggerItem>
					))}
				</Stagger>

				<Reveal className="mt-10 flex flex-wrap items-center gap-4">
					<Button asChild size="lg">
						<Link href="/projects">
							View all projects
							<ArrowRight size={17} />
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<a
							href="https://github.com/roberteggl"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github size={17} strokeWidth={1.75} />
							GitHub profile
						</a>
					</Button>
				</Reveal>
			</div>
		</section>
	)
}

export default ProjectsSection
