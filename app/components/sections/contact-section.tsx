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

const ContactSection = () => {
	return (
		<section id="contact" className="relative scroll-mt-24 overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 55% 40% at 50% 100%, var(--color-accent-soft), transparent 70%)'
				}}
			/>
			<div className="container-custom relative py-20 md:py-28">
				<SectionHeader
					number="06"
					eyebrow="Contact"
					title="Get in touch."
					description="Open to new opportunities and collaborations."
					align="center"
				/>

				<Stagger className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
					{CHANNELS.map((channel) => (
						<StaggerItem key={channel.label}>
							<a
								href={channel.href}
								target={channel.external ? '_blank' : undefined}
								rel={channel.external ? 'noopener noreferrer' : undefined}
								className="group flex h-full items-start gap-4 rounded-none border border-line bg-card p-5 hover:border-accent/50 md:p-6"
							>
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-accent text-accent-foreground">
									<channel.icon size={20} strokeWidth={1.75} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="flex items-center justify-between gap-2">
										<span className="block text-[17px] font-semibold text-foreground">
											{channel.label}
										</span>
										<ArrowUpRight
											size={17}
											className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
										/>
									</span>
									<span className="mt-0.5 block truncate font-mono text-[13px] text-muted-foreground">
										{channel.value}
									</span>
									<span className="mt-1 block text-[13px] text-muted-foreground">
										{channel.note}
									</span>
								</span>
							</a>
						</StaggerItem>
					))}
					<StaggerItem>
						<Link
							href="/keys"
							className="group flex h-full items-start gap-4 rounded-none border border-dashed border-line bg-surface/50 p-5 hover:border-accent md:p-6"
						>
							<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none border border-line text-accent">
								<KeyRound size={20} strokeWidth={1.75} />
							</span>
							<span className="min-w-0 flex-1">
								<span className="flex items-center justify-between gap-2">
									<span className="block text-[17px] font-semibold text-foreground">
										GPG keys
									</span>
									<ArrowUpRight
										size={17}
										className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
									/>
								</span>
								<span className="mt-0.5 block font-mono text-[13px] text-muted-foreground">
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
