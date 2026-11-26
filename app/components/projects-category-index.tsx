'use client'

import type { ProjectCategory } from '@/data/projects-data'

export type CategoryOption = {
	id: 'all' | ProjectCategory
	label: string
	count: number
}

type ProjectsCategoryIndexProps = {
	categories: CategoryOption[]
	selected: 'all' | ProjectCategory
	onSelect: (id: 'all' | ProjectCategory) => void
	visible?: boolean
}

const ProjectsCategoryIndex = ({
	categories,
	selected,
	onSelect,
	visible = true
}: ProjectsCategoryIndexProps) => {
	return (
		<nav
			aria-label="Filter by category"
			aria-hidden={!visible}
			className={`pointer-events-none fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 2xl:block ${
				visible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<ul className="flex flex-col gap-1">
				{categories.map((category, index) => {
					const isActive = selected === category.id
					const n = String(index + 1).padStart(2, '0')
					return (
						<li key={category.id}>
							<button
								type="button"
								onClick={() => onSelect(category.id)}
								aria-pressed={isActive}
								tabIndex={visible ? 0 : -1}
								className={`pointer-events-auto group relative flex items-center gap-3 py-1.5 pl-3 transition-colors duration-200 ${
									isActive
										? 'text-accent'
										: 'text-muted-foreground/55 hover:text-foreground'
								}`}
							>
								<span
									aria-hidden="true"
									className={`absolute bottom-1.5 left-0 top-1.5 w-px origin-center bg-accent transition-transform duration-300 ${
										isActive
											? 'scale-y-100'
											: 'scale-y-0 group-hover:scale-y-50'
									}`}
								/>
								<span className="font-mono text-[11px] tracking-[0.16em]">
									{n}
								</span>
								<span
									className={`overflow-hidden font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
										isActive
											? 'max-w-[6rem] opacity-100'
											: 'max-w-0 opacity-0 group-hover:max-w-[6rem] group-hover:opacity-70'
									}`}
								>
									{category.label}
								</span>
								<span
									className={`font-mono text-[10px] tracking-[0.12em] transition-opacity duration-200 ${
										isActive ? 'opacity-50' : 'opacity-0 group-hover:opacity-40'
									}`}
								>
									{category.count}
								</span>
							</button>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default ProjectsCategoryIndex
