'use client'
import { motion, useInView } from 'framer-motion'
import {
	ArrowRight,
	ArrowUpRight,
	ExternalLink,
	FileText,
	Github
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useRef } from 'react'
import {
	getFeaturedProjects,
	getProjectImageSrc,
	getProjectPath,
	type Project
} from '@/data/projects-data'
import SectionHeader from '../section-header'

interface ProjectCardProps {
	project: Project
	index: number
}

const ProjectCard = memo(({ project, index }: ProjectCardProps) => {
	const cardRef = useRef(null)
	const isInView = useInView(cardRef, {
		once: true,
		margin: '-50px 0px',
		amount: 0.2
	})

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
				delay: index * 0.1
			}
		}
	}

	const contentVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring' as const,
				damping: 25,
				stiffness: 200
			}
		}
	}

	return (
		<motion.div
			ref={cardRef}
			className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
			variants={cardVariants}
			initial="hidden"
			animate={isInView ? 'visible' : 'hidden'}
		>
			<motion.div
				className="w-full md:w-1/2 mb-6 md:mb-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				<div className="relative neo-card p-0 overflow-hidden mx-0 md:mx-4">
					<Link
						href={getProjectPath(project)}
						className="relative overflow-hidden group block"
					>
						<Image
							src={getProjectImageSrc(project.image)}
							alt={`${project.title} project screenshot`}
							className="w-full aspect-video transition-transform duration-500 object-cover group-hover:scale-102"
							loading="lazy"
							width={800}
							height={450}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</Link>
				</div>
			</motion.div>

			<motion.div
				className="w-full md:w-1/2"
				variants={contentVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="space-y-6">
					<motion.h3
						className="font-mono text-3xl font-bold flex items-center"
						variants={itemVariants}
					>
						<span className="inline-block w-3 h-3 mr-3 bg-accent" />
						<Link
							href={getProjectPath(project)}
							className="hover:text-accent transition-colors"
						>
							{project.title}
						</Link>
					</motion.h3>

					<motion.p className="text-muted-foreground" variants={itemVariants}>
						{project.description}
					</motion.p>

					<motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
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
					</motion.div>

					<motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
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
								className="neo-button p-2 flex items-center"
								aria-label={`GitHub repository for ${project.title}`}
							>
								<Github size={18} />
								<span className="ml-2">Code</span>
							</a>
						)}

						{project.demo && (
							<a
								href={project.demo}
								className="neo-button p-2 flex items-center"
								aria-label={`Live demo for ${project.title}`}
							>
								<ExternalLink size={18} />
								<span className="ml-2">View</span>
							</a>
						)}

						{project.docs && (
							<a
								href={project.docs}
								className="neo-button p-2 flex items-center"
								aria-label={`Documentation for ${project.title}`}
							>
								<FileText size={18} />
								<span className="ml-2">Docs</span>
							</a>
						)}
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	)
})

ProjectCard.displayName = 'ProjectCard'

const ProjectsSection = () => {
	const sectionRef = useRef(null)

	const featuredProjects = getFeaturedProjects()

	return (
		<section
			id="projects"
			className="section relative overflow-hidden py-32 min-h-screen bg-background"
			ref={sectionRef}
		>
			<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none">
					<h2 className="font-mono font-black text-[20vw] leading-none opacity-[0.03] -mt-20 tracking-tighter">
						PROJECTS
					</h2>
				</div>

				<div className="absolute left-20 top-1/3 w-48 h-48 bg-accent opacity-10 transform rotate-12" />
				<div className="max-sm:hidden absolute right-24 bottom-1/4 w-32 h-32 bg-secondary opacity-10" />
				<div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-dashed border-neo-border opacity-20" />
			</div>

			<div className="container-custom relative z-10">
				<SectionHeader number="03" title="Featured Projects" mbSize="mb-24" />

				<div className="space-y-16 md:space-y-10">
					{featuredProjects.map((project, index) => (
						<div
							key={project.slug}
							className="min-h-[400px] md:h-56 flex items-center justify-center"
						>
							<ProjectCard project={project} index={index} />
						</div>
					))}
				</div>

				<div className="flex justify-center mt-16">
					<Link
						href="/projects"
						className="neo-button !flex items-center group"
					>
						<span>View All Projects</span>
						<ArrowRight
							size={18}
							className="ml-2 group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>
			</div>
		</section>
	)
}

export default ProjectsSection
