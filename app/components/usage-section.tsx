import { Lock, ShieldCheck, TerminalSquare } from 'lucide-react'
import CopyButton from '@/components/keys/copy-button'

interface UsageSectionProps {
	className?: string
}

const IMPORT_CMD = 'curl https://eggl.dev/api/keys.asc | gpg --import'

const USES = [
	{
		icon: Lock,
		index: '01',
		title: 'Encryption',
		text: 'Encrypt messages so only I can read them.'
	},
	{
		icon: ShieldCheck,
		index: '02',
		title: 'Verification',
		text: 'Verify my signatures, commits, and releases.'
	}
] as const

export default function UsageSection({ className = '' }: UsageSectionProps) {
	return (
		<div className={className}>
			<div className="grid gap-8 md:grid-cols-2 md:gap-12">
				{USES.map((item) => (
					<div key={item.title} className="flex items-start gap-4">
						<span className="flex h-11 w-11 shrink-0 items-center justify-center text-accent">
							<item.icon size={20} strokeWidth={1.75} />
						</span>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-3">
								<span className="font-mono text-[11px] text-accent">
									{item.index}
								</span>
								<p className="text-[16px] font-medium text-foreground">
									{item.title}
								</p>
							</div>
							<p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
								{item.text}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-10">
				<div className="flex items-center gap-3">
					<span className="flex h-11 w-11 shrink-0 items-center justify-center text-accent">
						<TerminalSquare size={20} strokeWidth={1.75} />
					</span>
					<div>
						<p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
							03 · Import
						</p>
						<p className="mt-0.5 text-[16px] font-medium text-foreground">
							Pull the key into GnuPG
						</p>
					</div>
				</div>
				<div className="relative mt-4">
					<pre className="overflow-x-auto whitespace-pre-wrap break-all bg-surface/60 p-4 font-mono text-[13px] text-foreground/85">
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
