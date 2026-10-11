interface SectionHeaderProps {
	number: string
	eyebrow?: string
	title: string
	description?: string
	className?: string
	mbSize?: string
	align?: 'left' | 'center'
	/** Light-on-accent treatment for sticky signal panels */
	invert?: boolean
}

const SectionHeader = ({
	number,
	eyebrow,
	title,
	description,
	className = '',
	mbSize = 'mb-12 md:mb-16',
	align = 'left',
	invert = false
}: SectionHeaderProps) => {
	const centered = align === 'center'

	return (
		<div className={`${mbSize} ${centered ? 'text-center' : ''} ${className}`}>
			{eyebrow ? (
				<div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
					<span
						className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
							invert ? 'text-accent-foreground/70' : 'text-muted-foreground'
						}`}
					>
						{eyebrow}
					</span>
				</div>
			) : null}

			<div
				className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6 ${
					centered ? 'sm:justify-center' : ''
				}`}
			>
				<span
					aria-hidden="true"
					className={`select-none font-display text-6xl leading-none tracking-tighter md:text-7xl ${
						invert ? 'text-accent-foreground/20' : 'text-foreground/10'
					} ${centered ? 'sm:text-center' : ''}`}
				>
					{number}
				</span>

				<div className={centered ? 'sm:text-left' : ''}>
					<h2
						className={`font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl ${
							invert ? 'text-accent-foreground' : 'text-foreground'
						}`}
					>
						{title}
					</h2>

					{description ? (
						<p
							className={`mt-4 max-w-2xl text-lg leading-relaxed ${
								centered ? 'mx-auto sm:mx-0' : ''
							} ${
								invert ? 'text-accent-foreground/75' : 'text-muted-foreground'
							}`}
						>
							{description}
						</p>
					) : null}
				</div>
			</div>
		</div>
	)
}

export default SectionHeader
