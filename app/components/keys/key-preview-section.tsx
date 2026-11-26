import CopyButton from '@/components/keys/copy-button'
import { getKeyPreview } from '@/data/gpg-key'

interface KeyPreviewSectionProps {
	keyContent: string
	copyTitle?: string
	className?: string
}

export default function KeyPreviewSection({
	keyContent,
	copyTitle = 'Copy full key to clipboard',
	className = ''
}: KeyPreviewSectionProps) {
	return (
		<div className={`flex flex-col ${className}`}>
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						Block
					</p>
					<h3 className="mt-2 font-display text-2xl tracking-tight md:text-[1.75rem]">
						ASCII armor
					</h3>
				</div>
				<CopyButton text={keyContent} title={copyTitle} />
			</div>

			<p className="mt-2 text-sm text-muted-foreground">
				Preview of the public key. Copy grabs the full block.
			</p>

			<pre className="mt-5 max-h-80 flex-1 overflow-auto bg-surface/60 p-4 font-mono text-[12px] leading-relaxed text-foreground/80 md:p-5">
				{getKeyPreview(keyContent)}
			</pre>
		</div>
	)
}
