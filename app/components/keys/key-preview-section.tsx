import CopyButton from '@/components/keys/copy-button'
import { getKeyPreview } from '@/data/gpg-key'

interface KeyPreviewSectionProps {
	keyContent: string
	title?: string
	copyTitle?: string
	className?: string
}

export default function KeyPreviewSection({
	keyContent,
	title = 'Public Key',
	copyTitle = 'Copy full key to clipboard',
	className = ''
}: KeyPreviewSectionProps) {
	return (
		<div className={`luxe-card flex flex-col p-6 md:p-8 ${className}`}>
			<h3 className="font-display text-2xl tracking-tight">{title}</h3>
			<p className="mt-1.5 text-sm text-muted-foreground">
				Use the copy button to grab the full key.
			</p>

			<div className="relative mt-5 flex-1 rounded-none border border-line bg-surface-2/60">
				<pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all p-4 font-mono text-xs leading-relaxed text-foreground/80">
					{getKeyPreview(keyContent)}
				</pre>
				<CopyButton
					text={keyContent}
					title={copyTitle}
					className="absolute right-3 top-3"
				/>
			</div>
		</div>
	)
}
