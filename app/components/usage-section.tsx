import { Lock, ShieldCheck, TerminalSquare } from 'lucide-react'
import CopyButton from '@/components/keys/copy-button'

interface UsageSectionProps {
	className?: string
}

const IMPORT_CMD = 'curl https://eggl.dev/api/keys.asc | gpg --import'

export default function UsageSection({ className = '' }: UsageSectionProps) {
	const items = [
		{
			icon: Lock,
			title: 'Encryption',
			text: 'Encrypt messages to me so only I can read them.'
		},
		{
			icon: ShieldCheck,
			title: 'Verification',
			text: 'Verify my signatures, commits, and releases.'
		}
	]

	return (
		<div className={`luxe-card p-6 md:p-8 ${className}`}>
			<h3 className="font-display text-2xl tracking-tight">Usage</h3>
			<p className="mt-1.5 text-sm text-muted-foreground">
				Three steps to secure communication.
			</p>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{items.map((item) => (
					<div
						key={item.title}
						className="rounded-none border border-line bg-surface/60 p-5"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-none bg-accent text-accent-foreground">
							<item.icon size={18} strokeWidth={1.75} />
						</span>
						<p className="mt-3 font-semibold">{item.title}</p>
						<p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
					</div>
				))}
			</div>

			<div className="mt-4 rounded-none border border-line bg-surface/60 p-5">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-none border border-line text-accent">
						<TerminalSquare size={18} strokeWidth={1.75} />
					</span>
					<p className="font-semibold">Import command</p>
				</div>
				<div className="relative mt-4">
					<pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-none border border-line bg-background p-4 font-mono text-[13px]">
						{IMPORT_CMD}
					</pre>
					<CopyButton
						text={IMPORT_CMD}
						title="Copy command to clipboard"
						className="absolute right-2 top-2"
					/>
				</div>
			</div>
		</div>
	)
}
