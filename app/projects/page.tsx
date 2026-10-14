'use client'
import {
	ArrowLeft,
	ArrowUpRight,
	ExternalLink,
	FileText,
	Grid,
	List
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo, useState } from 'react'
import { Github } from '@/components/icons/brand-icons'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import {
	getAllProjects,
	getProjectImageSrc,
	getProjectPath,
	PROJECT_CATEGORY_COLORS,
	type Project
} from '@/data/projects-data'

const ActionLinks = ({ project }: { project: Project }) => {
	const cls =
		'inline-flex items-center gap-1.5 rounded-none border border-line px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors duration-150 hover:border-accent hover:text-accent'
	return (
		<>
			{project.github && (
				<a
					href={project.github}
					target="_blank"
					rel="noopener noreferrer"
					className={cls}
					aria-label={`GitHub repository for ${project.title}`}
					onClick={(e) => e.stopPropagation()}
				>
					<Github size={14} />
					Code
				</a>
			)}
			{project.demo && (
				<a
					href={project.demo}
					target="_blank"
					rel="noopener noreferrer"
					className={cls}
					aria-label={`Live demo for ${project.title}`}
					onClick={(e) => e.stopPropagation()}
				>
					<ExternalLink size={14} />
					Demo
				</a>
			)}
			{project.docs && (
				<a
					href={project.docs}
					target="_blank"
					rel="noopener noreferrer"
					className={cls}
					aria-label={`Documentation for ${project.title}`}
					onClick={(e) => e.stopPropagation()}
				>
					<FileText size={14} />
					Docs
				</a>
			)}
		</>
	)
}

const ProjectRow = memo(({ project }: { project: Project }) => (
	<Link
		href={getProjectPath(project)}
		className="group grid gap-5 border-t border-line py-7 transition-colors duration-150 last:border-b hover:bg-surface/40 md:grid-cols-[5.5rem_1fr_14rem] md:items-center md:gap-8 md:px-2 lg:grid-cols-[6rem_1fr_16rem]"
	>
		<span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
			{project.category}
		</span>
		<span className="min-w-0">
			<span className="flex flex-wrap items-center gap-2.5">
				<span className="font-display text-xl tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent md:text-2xl">
					{project.title}
				</span>
				{project.featured ? (
					<span className="border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
						Featured
					</span>
				) : null}
			</span>
			<span className="mt-2 line-clamp-2 block max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
				{project.description}
			</span>
			<span className="mt-3 flex flex-wrap gap-1.5">
				{project.technologies.slice(0, 5).map((tech) => (
					<span key={tech} className="signal-chip">
						{tech}
					</span>
				))}
			</span>
		</span>
		<span className="relative hidden overflow-hidden border border-line md:block">
			<Image
				src={getProjectImageSrc(project.image)}
				alt=""
				className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				width={320}
				height={200}
				loading="lazy"
			/>
			<span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center border border-line bg-background text-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
				<ArrowUpRight size={15} />
			</span>
		</span>
	</Link>
))
ProjectRow.displayName = 'ProjectRow'

const ProjectGridCard = memo(({ project }: { project: Project }) => (
	<article className="signal-card signal-card-hover group flex h-full flex-col overflow-hidden">
		<Link
			href={getProjectPath(project)}
			className="relative block overflow-hidden"
		>
			<Image
				src={getProjectImageSrc(project.image)}
				alt={`${project.title} project screenshot`}
				className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				width={800}
				height={450}
				loading="lazy"
			/>
			<div className="absolute left-3 top-3 flex gap-2">
				<span
					className={`rounded-[2px] border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider backdrop-blur ${PROJECT_CATEGORY_COLORS[project.category]}`}
				>
					{project.category}
				</span>
				{project.featured && (
					<span className="rounded-[2px] border border-accent/40 bg-background/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-accent backdrop-blur">
						Featured
					</span>
				)}
			</div>
		</Link>
		<div className="flex flex-1 flex-col p-5">
			<Link href={getProjectPath(project)}>
				<h3 className="font-display text-xl tracking-tight transition-colors duration-150 group-hover:text-accent">
					{project.title}
				</h3>
			</Link>
			<p className="mb-4 mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
				{project.description}
			</p>
			<div className="mb-4 flex flex-wrap gap-1.5">
				{project.technologies.slice(0, 3).map((tech) => (
					<span key={tech} className="signal-chip">
						{tech}
					</span>
				))}
				{project.technologies.length > 3 && (
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="signal-chip cursor-default">
								+{project.technologies.length - 3}
							</span>
						</TooltipTrigger>
						<TooltipContent side="top">
							<div className="flex flex-wrap gap-1.5">
								{project.technologies.slice(3).map((tech) => (
									<span key={tech} className="font-mono text-xs">
										{tech}
									</span>
								))}
							</div>
						</TooltipContent>
					</Tooltip>
				)}
			</div>
			<div className="mt-auto flex flex-wrap gap-2">
				<Link
					href={getProjectPath(project)}
					className="inline-flex items-center gap-1.5 rounded-none border border-line px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors duration-150 hover:border-accent hover:text-accent"
				>
					<ArrowUpRight size={14} />
					Details
				</Link>
				<ActionLinks project={project} />
			</div>
		</div>
	</article>
))
ProjectGridCard.displayName = 'ProjectGridCard'

const ProjectsPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
	const [searchTerm, setSearchTerm] = useState('')

	const projects = getAllProjects()

	const categories = [
		{ id: 'all', label: 'All', count: projects.length },
		{
			id: 'mobile',
			label: 'Mobile',
			count: projects.filter((p) => p.category === 'mobile').length
		},
		{
			id: 'web',
			label: 'Web',
			count: projects.filter((p) => p.category === 'web').length
		},
		{
			id: 'api',
			label: 'APIs',
			count: projects.filter((p) => p.category === 'api').length
		},
		{
			id: 'tool',
			label: 'Tools',
			count: projects.filter((p) => p.category === 'tool').length
		},
		{
			id: 'fullstack',
			label: 'Full Stack',
			count: projects.filter((p) => p.category === 'fullstack').length
		}
	]

	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesCategory =
				selectedCategory === 'all' || project.category === selectedCategory
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.technologies.some((tech) =>
					tech.toLowerCase().includes(searchTerm.toLowerCase())
				)
			return matchesCategory && matchesSearch
		})
	}, [selectedCategory, searchTerm, projects])

	return (
		<TooltipProvider delayDuration={150}>
			<div className="container-custom pb-24 pt-28 md:pt-36">
				<header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10">
					<div className="max-w-2xl">
						<h1 className="font-display text-5xl tracking-tight md:text-6xl">
							Projects.
						</h1>
						<p className="mt-4 text-lg leading-relaxed text-muted-foreground">
							{filteredProjects.length} of {projects.length}: campus apps to
							infrastructure tooling.
						</p>
					</div>
					<div className="flex items-center gap-1 border border-line p-1">
						<button
							type="button"
							onClick={() => setViewMode('list')}
							aria-label="List view"
							aria-pressed={viewMode === 'list'}
							className={`rounded-none p-2.5 transition-colors duration-150 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
						>
							<List size={16} />
						</button>
						<button
							type="button"
							onClick={() => setViewMode('grid')}
							aria-label="Grid view"
							aria-pressed={viewMode === 'grid'}
							className={`rounded-none p-2.5 transition-colors duration-150 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
						>
							<Grid size={16} />
						</button>
					</div>
				</header>

				<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<button
								type="button"
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`rounded-none border px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors duration-150 ${
									selectedCategory === category.id
										? 'border-accent bg-accent text-accent-foreground'
										: 'border-line text-muted-foreground hover:border-accent/50 hover:text-foreground'
								}`}
							>
								{category.label}
								<span className="ml-1.5 opacity-60">{category.count}</span>
							</button>
						))}
					</div>
					<input
						type="search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search…"
						aria-label="Search projects"
						className="search-input w-full lg:max-w-xs"
					/>
				</div>

				{viewMode === 'list' ? (
					<div>
						{filteredProjects.map((project) => (
							<ProjectRow key={project.slug} project={project} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
						{filteredProjects.map((project) => (
							<ProjectGridCard key={project.slug} project={project} />
						))}
					</div>
				)}

				{filteredProjects.length === 0 && (
					<div className="signal-card mx-auto mt-8 max-w-md p-12 text-center">
						<p className="text-muted-foreground">
							No projects found matching your criteria.
						</p>
						<button
							type="button"
							onClick={() => {
								setSelectedCategory('all')
								setSearchTerm('')
							}}
							className="mt-5 inline-flex h-11 items-center gap-2 rounded-none bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
						>
							<ArrowLeft size={15} />
							Clear filters
						</button>
					</div>
				)}
			</div>
		</TooltipProvider>
	)
}

export default ProjectsPage
