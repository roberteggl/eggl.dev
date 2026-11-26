'use client'
import { ArrowUpRight, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'
import { Github, Linkedin } from '../icons/brand-icons'
import { Reveal, Stagger, StaggerItem } from '../reveal'
import SectionHeader from '../section-header'
import { Button } from '../ui/button'

const CHANNELS = [
	{
		icon: Mail,
		label: 'Email',
		value: 'info@eggl.dev',
		href: 'mailto:info@eggl.dev',
		note: 'Best for longer conversations'
	},
	{
		icon: Github,
		label: 'GitHub',
		value: 'github.com/roberteggl',
		href: 'https://github.com/roberteggl',
		note: 'Code, issues & pull requests',
		external: true
	},
	{
		icon: Linkedin,
		label: 'LinkedIn',
		value: 'linkedin.com/in/roberteggl',
		href: 'https://linkedin.com/in/roberteggl',
		note: 'Professional network',
		external: true
	}
]

/** Each cell owns its border + fill so soft-in staggers box-by-box with no grey flash */
const CHANNEL_CELL =
	'border border-line bg-background -mb-px last:mb-0 md:odd:-mr-px md:[&:nth-child(n+3)]:mb-0'

const ContactSection = () => {
	return (
		<section id="contact" className="relative scroll-mt-24 overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_100%,rgba(45,212,191,0.1),transparent_70%)]"
			/>
			<div className="container-custom relative py-24 md:py-32">
				<SectionHeader
					number="05"
					eyebrow="Contact"
					title="Let's talk."
					description="Open to thoughtful collaborations and new opportunities."
					align="center"
				/>

				<Stagger className="mx-auto mt-2 grid max-w-3xl md:grid-cols-2">
					{CHANNELS.map((channel, i) => (
						<StaggerItem key={channel.label} index={i} className={CHANNEL_CELL}>
							<a
								href={channel.href}
								target={channel.external ? '_blank' : undefined}
								rel={channel.external ? 'noopener noreferrer' : undefined}
								className="group flex h-full items-start gap-4 p-5 transition-colors hover:bg-surface md:p-6"
							>
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border border-line text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
									<channel.icon size={18} strokeWidth={1.75} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="flex items-center justify-between gap-2">
										<span className="block text-[16px] font-medium text-foreground">
											{channel.label}
										</span>
										<ArrowUpRight
											size={16}
											className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
										/>
									</span>
									<span className="mt-0.5 block truncate font-mono text-[12px] text-muted-foreground">
										{channel.value}
									</span>
									<span className="mt-1 block text-[13px] text-muted-foreground">
										{channel.note}
									</span>
								</span>
							</a>
						</StaggerItem>
					))}
					<StaggerItem index={CHANNELS.length} className={CHANNEL_CELL}>
						<Link
							href="/keys"
							className="group flex h-full items-start gap-4 p-5 transition-colors hover:bg-surface md:p-6"
						>
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] border border-dashed border-line text-accent">
								<KeyRound size={18} strokeWidth={1.75} />
							</span>
							<span className="min-w-0 flex-1">
								<span className="flex items-center justify-between gap-2">
									<span className="block text-[16px] font-medium text-foreground">
										GPG keys
									</span>
									<ArrowUpRight
										size={16}
										className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
									/>
								</span>
								<span className="mt-0.5 block font-mono text-[12px] text-muted-foreground">
									eggl.dev/keys
								</span>
								<span className="mt-1 block text-[13px] text-muted-foreground">
									Encrypted messages, verified and private
								</span>
							</span>
						</Link>
					</StaggerItem>
				</Stagger>

				<Reveal className="mt-12 text-center">
					<Button asChild size="lg" className="h-14 px-10 text-base">
						<a href="mailto:info@eggl.dev">
							Say hello
							<span aria-hidden="true">→</span>
						</a>
					</Button>
				</Reveal>
			</div>
		</section>
	)
}

export default ContactSection
