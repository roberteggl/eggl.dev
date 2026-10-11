import { Calendar, Fingerprint, Key, Mail } from 'lucide-react'
import type { GPGKeyInfo } from '@/data/gpg-key'

interface KeyInfoSectionProps {
	keyInfo: GPGKeyInfo
	title?: string
	className?: string
}

export default function KeyInfoSection({
	keyInfo,
	title = 'Key Information',
	className = ''
}: KeyInfoSectionProps) {
	const rows = [
		{
			icon: Mail,
			label: 'E-Mail',
			content: (
				<a
					className="text-[15px] text-foreground underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
					href={`mailto:${keyInfo.email}`}
				>
					{keyInfo.email}
				</a>
			)
		},
		{
			icon: Key,
			label: 'Key ID',
			content: (
				<span className="font-mono text-sm text-muted-foreground">
					{keyInfo.keyId}
				</span>
			)
		},
		{
			icon: Fingerprint,
			label: 'Fingerprint',
			content: (
				<span className="break-all font-mono text-[13px] leading-relaxed text-muted-foreground">
					{keyInfo.fingerprint}
				</span>
			)
		},
		{
			icon: Calendar,
			label: 'Validity',
			content: (
				<span className="font-mono text-sm text-muted-foreground">
					{keyInfo.validity.from} to {keyInfo.validity.to}
				</span>
			)
		}
	]

	return (
		<div className={`luxe-card p-6 md:p-8 ${className}`}>
			<h3 className="font-display text-2xl tracking-tight">{title}</h3>
			<div className="mt-2 flex items-center gap-2">
				<span
					className={`inline-flex items-center rounded-none border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
						keyInfo.status === 'active'
							? 'border-accent/40 bg-accent-soft text-accent'
							: 'border-line text-muted-foreground'
					}`}
				>
					{keyInfo.status}
				</span>
			</div>

			<div className="mt-6 divide-y divide-line border-y border-line">
				{rows.map((row) => (
					<div key={row.label} className="flex items-start gap-4 py-4">
						<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-line bg-surface-2 text-accent">
							<row.icon size={17} strokeWidth={1.75} />
						</span>
						<div className="min-w-0 flex-1">
							<p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
								{row.label}
							</p>
							<div className="mt-1">{row.content}</div>
						</div>
					</div>
				))}
			</div>

			{keyInfo.description && (
				<p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
					{keyInfo.description}
				</p>
			)}
		</div>
	)
}
