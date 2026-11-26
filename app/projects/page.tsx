'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo, useState } from 'react'
import PageHero from '@/components/page-hero'
import {
	getAllProjects,
	getProjectImageSrc,
	getProjectPath,
	type Project,
	type ProjectCategory
} from '@/data/projects-data'

const CATEGORIES: { id: 'all' | ProjectCategory; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'mobile', label: 'Mobile' },
	{ id: 'web', label: 'Web' },
	{ id: 'api', label: 'APIs' },
	{ id: 'tool', label: 'Tools' },
	{ id: 'fullstack', label: 'Full Stack' }
]

const ProjectRow = memo(
	({ project, index }: { project: Project; index: number }) => {
		const n = String(index + 1).padStart(2, '0')

		return (
			<li className="border-b border-line">
				<Link
					href={getProjectPath(project)}
					className="group relative grid gap-4 py-7 pl-5 transition-colors duration-150 hover:bg-surface/30 md:grid-cols-[3.5rem_6.5rem_1fr_12rem] md:items-center md:gap-8 md:py-8 lg:grid-cols-[3.5rem_7rem_1fr_14rem]"
				>
					<span
						aria-hidden="true"
						className="absolute bottom-0 left-0 top-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
					/>
					<span className="hidden font-mono text-[11px] text-accent md:block">
						{n}
					</span>
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
					<span className="relative hidden overflow-hidden md:block">
						<Image
							src={getProjectImageSrc(project.image)}
							alt=""
							className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							width={320}
							height={200}
							loading="lazy"
						/>
					</span>
				</Link>
			</li>
		)
	}
)
ProjectRow.displayName = 'ProjectRow'

export default function ProjectsPage() {
	const [selectedCategory, setSelectedCategory] = useState<
		'all' | ProjectCategory
	>('all')
	const [searchTerm, setSearchTerm] = useState('')

	const projects = getAllProjects()

	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = { all: projects.length }
		for (const project of projects) {
			counts[project.category] = (counts[project.category] ?? 0) + 1
		}
		return counts
	}, [projects])

	const filteredProjects = useMemo(() => {
		const query = searchTerm.trim().toLowerCase()
		return projects.filter((project) => {
			const matchesCategory =
				selectedCategory === 'all' || project.category === selectedCategory
			const matchesSearch =
				!query ||
				project.title.toLowerCase().includes(query) ||
				project.description.toLowerCase().includes(query) ||
				project.technologies.some((tech) => tech.toLowerCase().includes(query))
			return matchesCategory && matchesSearch
		})
	}, [selectedCategory, searchTerm, projects])

	return (
		<div className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%)]"
			/>

			<div className="container-custom relative pb-24 pt-28 md:pt-36">
				<PageHero
					eyebrow="Work"
					title="Projects."
					description={`${filteredProjects.length} of ${projects.length} — campus apps to infrastructure tooling.`}
				/>

				<div className="mb-10 flex flex-col gap-5 border-b border-line pb-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
					<nav
						aria-label="Filter by category"
						className="flex flex-wrap gap-x-5 gap-y-2"
					>
						{CATEGORIES.map((category) => {
							const active = selectedCategory === category.id
							const count = categoryCounts[category.id] ?? 0
							return (
								<button
									type="button"
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
									className={`font-mono text-[12px] uppercase tracking-[0.14em] transition-colors duration-150 ${
										active
											? 'text-accent'
											: 'text-muted-foreground hover:text-foreground'
									}`}
								>
									{category.label}
									<span className="ml-1.5 opacity-50">{count}</span>
								</button>
							)
						})}
					</nav>
					<input
						type="search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search…"
						aria-label="Search projects"
						className="search-input w-full lg:max-w-xs"
					/>
				</div>

				{filteredProjects.length > 0 ? (
					<ul>
						{filteredProjects.map((project, index) => (
							<ProjectRow key={project.slug} project={project} index={index} />
						))}
					</ul>
				) : (
					<div className="py-14">
						<h3 className="font-display text-xl tracking-tight">
							No projects found
						</h3>
						<p className="mt-2 text-muted-foreground">
							Nothing matches those filters.
						</p>
						<button
							type="button"
							onClick={() => {
								setSelectedCategory('all')
								setSearchTerm('')
							}}
							className="group mt-6 inline-flex items-center gap-2 border-b border-accent/40 pb-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-accent transition-colors hover:border-accent"
						>
							<ArrowLeft
								size={15}
								className="transition-transform duration-300 group-hover:-translate-x-1"
							/>
							Clear filters
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
