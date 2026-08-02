'use client'
import { motion } from 'framer-motion'
import {
	ArrowUpRight,
	ExternalLink,
	FileText,
	Github,
	Grid,
	Home,
	List
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo, useState } from 'react'
import SectionHeader from '@/components/section-header'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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

interface ProjectCardProps {
	project: Project
	index: number
	viewMode: 'grid' | 'list'
}

const ProjectCard = memo(({ project, index, viewMode }: ProjectCardProps) => {
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 30
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring' as const,
				damping: 20,
				stiffness: 90,
				delay: index * 0.05
			}
		}
	}

	const categoryColors = PROJECT_CATEGORY_COLORS

	if (viewMode === 'grid') {
		return (
			<motion.div
				className="group"
				variants={cardVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: false, margin: '-50px 0px', amount: 0.2 }}
			>
				<div className="neo-card p-0 overflow-hidden h-full flex flex-col">
					<Link
						href={getProjectPath(project)}
						className="relative overflow-hidden block"
					>
						<Image
							src={getProjectImageSrc(project.image)}
							alt={`${project.title} project screenshot`}
							className="w-full aspect-video transition-transform duration-500 object-cover group-hover:scale-105"
							width={800}
							height={450}
							loading="lazy"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						<div className="absolute top-4 left-4">
							<span
								className={`px-3 py-1 text-xs font-mono border-2 ${categoryColors[project.category]}`}
							>
								{project.category.toUpperCase()}
							</span>
						</div>

						{project.featured && (
							<div className="absolute top-4 right-4">
								<span className="px-3 py-1 text-xs font-mono border-2 bg-secondary/20 border-secondary/40 text-secondary-foreground">
									FEATURED
								</span>
							</div>
						)}
					</Link>

					<div className="p-6 flex-1 flex flex-col">
						<Link href={getProjectPath(project)}>
							<h3 className="font-mono text-xl font-bold mb-3 group-hover:text-accent transition-colors">
								{project.title}
							</h3>
						</Link>

						<p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-4">
							{project.description}
						</p>

						<div className="flex flex-wrap gap-2 mb-4">
							{project.technologies.slice(0, 3).map((tech, techIndex) => (
								<span
									key={techIndex}
									className="px-2 py-1 text-xs font-mono border relative bg-tertiary/20 border-tertiary/40"
									style={{
										boxShadow: '1px 1px 0 hsl(var(--tertiary) / 0.5)'
									}}
								>
									{tech}
								</span>
							))}
							{project.technologies.length > 3 && (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="px-2 py-1 text-xs font-mono border relative bg-tertiary/20 border-tertiary/40 cursor-default">
											+{project.technologies.length - 3}
										</span>
									</TooltipTrigger>
									<TooltipContent side="top">
										<div className="flex flex-wrap gap-1.5">
											{project.technologies.slice(3).map((tech) => (
												<span
													key={tech}
													className="px-2 py-0.5 text-xs font-mono border bg-tertiary/20 border-tertiary/40"
												>
													{tech}
												</span>
											))}
										</div>
									</TooltipContent>
								</Tooltip>
							)}
						</div>

						<div className="flex flex-wrap gap-2 mt-auto">
							<Link
								href={getProjectPath(project)}
								className="neo-button p-2 flex items-center text-sm"
							>
								<ArrowUpRight size={16} />
								<span className="ml-1">Details</span>
							</Link>

							{project.github && (
								<a
									href={project.github}
									className="neo-button p-2 !flex items-center text-sm"
									aria-label={`GitHub repository for ${project.title}`}
								>
									<Github size={16} />
									<span className="ml-1">Code</span>
								</a>
							)}

							{project.demo && (
								<a
									href={project.demo}
									className="neo-button p-2 !flex items-center text-sm"
									aria-label={`Live demo for ${project.title}`}
								>
									<ExternalLink size={16} />
									<span className="ml-1">Demo</span>
								</a>
							)}

							{project.docs && (
								<a
									href={project.docs}
									className="neo-button p-2 !flex items-center text-sm"
									aria-label={`Documentation for ${project.title}`}
								>
									<FileText size={16} />
									<span className="ml-1">Docs</span>
								</a>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div
			className="neo-card p-6"
			variants={cardVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: false, margin: '-50px 0px', amount: 0.2 }}
		>
			<div className="flex flex-col md:flex-row gap-6">
				<div className="md:w-1/3">
					<Link
						href={getProjectPath(project)}
						className="relative overflow-hidden neo-card p-0 block group/image"
					>
						<Image
							src={getProjectImageSrc(project.image)}
							alt={`${project.title} project screenshot`}
							className="w-full aspect-video object-cover transition-transform duration-500 group-hover/image:scale-105"
							width={800}
							height={450}
							loading="lazy"
						/>
					</Link>
				</div>

				<div className="md:w-2/3 flex flex-col">
					<div className="flex items-start justify-between mb-3 gap-4">
						<Link href={getProjectPath(project)}>
							<h3 className="font-mono text-2xl font-bold hover:text-accent transition-colors">
								{project.title}
							</h3>
						</Link>
						<div className="flex gap-2">
							<span
								className={`px-3 py-1 text-xs font-mono border-2 ${categoryColors[project.category]}`}
							>
								{project.category.toUpperCase()}
							</span>
							{project.featured && (
								<span className="px-3 py-1 text-xs font-mono border-2 bg-secondary/20 border-secondary/40 text-secondary-foreground">
									FEATURED
								</span>
							)}
						</div>
					</div>

					<p className="text-muted-foreground mb-4 flex-1">
						{project.description}
					</p>

					<div className="flex flex-wrap gap-2 mb-4">
						{project.technologies.map((tech, techIndex) => (
							<span
								key={techIndex}
								className="px-3 py-1.5 text-xs font-mono border-2 relative bg-tertiary/20 border-tertiary/40"
								style={{
									boxShadow: '2px 2px 0 hsl(var(--tertiary) / 0.5)'
								}}
							>
								{tech}
							</span>
						))}
					</div>

					<div className="flex flex-wrap gap-3">
						<Link
							href={getProjectPath(project)}
							className="neo-button p-2 flex items-center"
						>
							<ArrowUpRight size={18} />
							<span className="ml-2">Details</span>
						</Link>

						{project.github && (
							<a
								href={project.github}
								className="neo-button p-2 !flex items-center"
								aria-label={`GitHub repository for ${project.title}`}
							>
								<Github size={18} />
								<span className="ml-2">Code</span>
							</a>
						)}

						{project.demo && (
							<a
								href={project.demo}
								className="neo-button p-2 !flex items-center"
								aria-label={`Live demo for ${project.title}`}
							>
								<ExternalLink size={18} />
								<span className="ml-2">Demo</span>
							</a>
						)}

						{project.docs && (
							<a
								href={project.docs}
								className="neo-button p-2 !flex items-center"
								aria-label={`Documentation for ${project.title}`}
							>
								<FileText size={18} />
								<span className="ml-2">Docs</span>
							</a>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	)
})

ProjectCard.displayName = 'ProjectCard'

const ProjectsPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [searchTerm, setSearchTerm] = useState('')

	const projects = getAllProjects()

	const categories = [
		{ id: 'all', label: 'All Projects', count: projects.length },
		{
			id: 'mobile',
			label: 'Mobile Apps',
			count: projects.filter((p) => p.category === 'mobile').length
		},
		{
			id: 'web',
			label: 'Web Apps',
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
	}, [selectedCategory, searchTerm])

	return (
		<TooltipProvider delayDuration={200}>
			<div className="min-h-screen bg-background">
				<div className="container-custom py-8 mt-12">
					<Breadcrumb>
						<BreadcrumbList className="font-mono">
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link
										href="/"
										className="flex items-center gap-1 hover:text-accent transition-colors duration-200"
									>
										<Home size={14} />
										<span>Home</span>
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Projects</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<div className="fixed top-0 left-0 w-full overflow-hidden pointer-events-none select-none">
						<h2 className="font-mono font-black text-[25vw] leading-none opacity-[0.03] -mt-16 tracking-tighter">
							PROJECTS
						</h2>
					</div>
					<div className="flex items-center justify-end mb-8">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setViewMode('grid')}
								className={`p-2 border-2 ${viewMode === 'grid' ? 'bg-accent border-accent' : 'bg-background border-neo-border'} shadow-neo`}
							>
								<Grid size={18} />
							</button>
							<button
								type="button"
								onClick={() => setViewMode('list')}
								className={`p-2 border-2 ${viewMode === 'list' ? 'bg-accent border-accent' : 'bg-background border-neo-border'} shadow-neo`}
							>
								<List size={18} />
							</button>
						</div>
					</div>

					<SectionHeader number="01" title="All Projects" mbSize="mb-8" />

					<h1 className="sr-only">Projects - Robert Eggl</h1>

					<div className="mb-8">
						<div className="flex items-center gap-5">
							<div className="flex flex-wrap gap-3">
								{categories.map((category) => (
									<button
										type="button"
										key={category.id}
										onClick={() => setSelectedCategory(category.id)}
										className={`px-4 py-2 text-sm font-mono border-2 transition-all ${
											selectedCategory === category.id
												? 'bg-accent border-accent text-accent-foreground'
												: 'bg-background border-neo-border hover:border-accent'
										} shadow-neo-thin`}
									>
										{category.label} ({category.count})
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="mb-6">
						<p className="text-muted-foreground font-mono">
							Showing {filteredProjects.length} of {projects.length} projects
						</p>
					</div>
				</div>

				<div className="container-custom pb-16">
					{viewMode === 'grid' ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProjects.map((project, index) => (
								<ProjectCard
									key={project.slug}
									project={project}
									index={index}
									viewMode={viewMode}
								/>
							))}
						</div>
					) : (
						<div className="space-y-6">
							{filteredProjects.map((project, index) => (
								<ProjectCard
									key={project.slug}
									project={project}
									index={index}
									viewMode={viewMode}
								/>
							))}
						</div>
					)}

					{filteredProjects.length === 0 && (
						<div className="text-center py-16">
							<p className="text-muted-foreground font-mono text-lg">
								No projects found matching your criteria.
							</p>
							<button
								type="button"
								onClick={() => {
									setSelectedCategory('all')
									setSearchTerm('')
								}}
								className="neo-button mt-4"
							>
								Clear Filters
							</button>
						</div>
					)}
				</div>
			</div>
		</TooltipProvider>
	)
}

export default ProjectsPage
