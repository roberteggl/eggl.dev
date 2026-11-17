import { ArrowLeft, BookOpen, ExternalLink, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Github } from '@/components/icons/brand-icons'
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
		<article className="container-custom max-w-4xl pb-24 pt-28 md:pt-36">
			<Link
				href="/projects"
				className="group mb-10 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-accent"
			>
				<ArrowLeft
					size={15}
					className="transition-transform duration-300 group-hover:-translate-x-1"
				/>
				All projects
			</Link>

			<div className="relative overflow-hidden border border-line bg-surface">
				<Image
					src={getProjectImageSrc(project.image)}
					alt={`${project.title} project screenshot`}
					className="aspect-video w-full object-cover"
					width={1200}
					height={675}
					priority
				/>
				<div className="absolute left-4 top-4 flex flex-wrap gap-2">
					<span
						className={`rounded-[2px] border px-3 py-1 font-mono text-[11px] uppercase tracking-wider backdrop-blur ${PROJECT_CATEGORY_COLORS[project.category]}`}
					>
						{PROJECT_CATEGORY_LABELS[project.category]}
					</span>
					{project.featured && (
						<span className="rounded-[2px] border border-accent/40 bg-background/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent backdrop-blur">
							Featured
						</span>
					)}
				</div>
			</div>

			<header className="mb-10 mt-10 border-b border-line pb-10">
				<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					Case
				</p>
				<h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-balance text-foreground">
					{project.title}
				</h1>
				<p className="mt-5 max-w-2xl border-l border-accent/60 pl-5 text-lg leading-relaxed text-muted-foreground">
					{project.description}
				</p>
			</header>

			<section className="mb-8">
				<h2 className="eyebrow mb-4">Technologies</h2>
				<div className="flex flex-wrap gap-2">
					{project.technologies.map((tech) => (
						<span key={tech} className="signal-chip">
							{tech}
						</span>
					))}
				</div>
			</section>

			<div className="mb-14 flex flex-wrap gap-2.5">
				{project.github && (
					<a
						href={project.github}
						className="inline-flex h-11 items-center gap-2 rounded-none bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github size={16} />
						View on GitHub
					</a>
				)}
				{project.demo && (
					<a
						href={project.demo}
						className="inline-flex h-11 items-center gap-2 rounded-none border border-line px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink size={16} />
						Live Demo
					</a>
				)}
				{project.docs && (
					<a
						href={project.docs}
						className="inline-flex h-11 items-center gap-2 rounded-none border border-line px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						<FileText size={16} />
						Docs
					</a>
				)}
				{blogPath && (
					<Link
						href={blogPath}
						className="inline-flex h-11 items-center gap-2 rounded-none border border-line px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
					>
						<BookOpen size={16} />
						Read Blog Post
					</Link>
				)}
			</div>

			{relatedProjects.length > 0 && (
				<section className="border-t border-line pt-10">
					<h2 className="eyebrow mb-6">Related projects</h2>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						{relatedProjects.map((relatedProject) => (
							<Link
								key={relatedProject.slug}
								href={getProjectPath(relatedProject)}
								className="group flex gap-3 border border-line bg-surface p-4 transition-colors hover:border-accent/50"
							>
								<div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-none border border-line">
									<Image
										src={getProjectImageSrc(relatedProject.image)}
										alt={`${relatedProject.title} project screenshot`}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										width={80}
										height={56}
										loading="lazy"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h3 className="truncate text-[15px] font-semibold transition-colors group-hover:text-accent">
										{relatedProject.title}
									</h3>
									<p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
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
