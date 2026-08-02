import {
	ArrowLeft,
	BookOpen,
	ExternalLink,
	FileText,
	Github
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
	getAllProjects,
	getProjectBlogPath,
	getProjectBySlug,
	getProjectImageSrc,
	getProjectPath,
	getRelatedProjects,
	PROJECT_CATEGORY_COLORS,
	PROJECT_CATEGORY_LABELS
} from '@/data/projects-data'

export const generateStaticParams = async () =>
	getAllProjects().map((project) => ({ slug: project.slug }))

export default async function ProjectPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const project = getProjectBySlug(slug)

	if (!project) {
		notFound()
	}

	const relatedProjects = getRelatedProjects(project)
	const blogPath = getProjectBlogPath(project)

	return (
		<article className="mt-12 py-8 md:py-10">
			<Link
				href="/projects"
				className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-accent transition-colors mb-6"
			>
				<ArrowLeft size={14} />
				Back to all projects
			</Link>

			<div className="neo-card p-0 overflow-hidden mb-8">
				<div className="relative">
					<Image
						src={getProjectImageSrc(project.image)}
						alt={`${project.title} project screenshot`}
						className="w-full aspect-video object-cover"
						width={1200}
						height={675}
						priority
					/>
					<div className="absolute top-4 left-4 flex flex-wrap gap-2">
						<span
							className={`px-3 py-1 text-xs font-mono border-2 ${PROJECT_CATEGORY_COLORS[project.category]}`}
						>
							{PROJECT_CATEGORY_LABELS[project.category].toUpperCase()}
						</span>
						{project.featured && (
							<span className="px-3 py-1 text-xs font-mono border-2 bg-secondary/20 border-secondary/40 text-secondary-foreground">
								FEATURED
							</span>
						)}
					</div>
				</div>
			</div>

			<header className="mb-8">
				<h1 className="text-2xl md:text-3xl font-bold font-mono mb-4 leading-tight text-accent">
					{project.title}
				</h1>

				<p className="text-sm md:text-base text-muted-foreground font-mono leading-relaxed">
					{'>'} {project.description}
				</p>
			</header>

			<section className="mb-8">
				<h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
					{'// Technologies'}
				</h2>
				<div className="flex flex-wrap gap-2">
					{project.technologies.map((tech) => (
						<span
							key={tech}
							className="px-3 py-1.5 text-xs font-mono border-2 bg-tertiary/20 border-tertiary/40"
							style={{
								boxShadow: '2px 2px 0 hsl(var(--tertiary) / 0.5)'
							}}
						>
							{tech}
						</span>
					))}
				</div>
			</section>

			<div className="flex flex-wrap gap-2 mb-12">
				{project.github && (
					<a
						href={project.github}
						className="neo-button p-2 flex items-center text-sm"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github size={16} />
						<span className="ml-2">View on GitHub</span>
					</a>
				)}

				{project.demo && (
					<a
						href={project.demo}
						className="neo-button p-2 flex items-center text-sm"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink size={16} />
						<span className="ml-2">Live Demo</span>
					</a>
				)}

				{project.docs && (
					<a
						href={project.docs}
						className="neo-button p-2 flex items-center text-sm"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FileText size={16} />
						<span className="ml-2">Docs</span>
					</a>
				)}

				{blogPath && (
					<Link
						href={blogPath}
						className="neo-button p-2 flex items-center text-sm"
					>
						<BookOpen size={16} />
						<span className="ml-2">Read Blog Post</span>
					</Link>
				)}
			</div>

			{relatedProjects.length > 0 && (
				<section>
					<h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
						{'// Related Projects'}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{relatedProjects.map((relatedProject) => (
							<Link
								key={relatedProject.slug}
								href={getProjectPath(relatedProject)}
								className="neo-card p-3 flex gap-3 group items-start"
							>
								<div className="relative overflow-hidden shrink-0 w-20 h-14 border border-neo-border">
									<Image
										src={getProjectImageSrc(relatedProject.image)}
										alt={`${relatedProject.title} project screenshot`}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										width={80}
										height={56}
										loading="lazy"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="font-mono text-sm font-bold mb-1 group-hover:text-accent transition-colors truncate">
										{relatedProject.title}
									</h3>
									<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
										{relatedProject.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</article>
	)
}
