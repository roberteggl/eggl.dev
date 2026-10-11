export function SectionDivider({ className = '' }: { className?: string }) {
	return (
		<div aria-hidden="true" className={`container-custom ${className}`}>
			<div className="h-px w-full bg-foreground/15" />
		</div>
	)
}
