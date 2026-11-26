import { Download } from 'lucide-react'
import type { Metadata } from 'next'
import KeyCard from '@/components/keys/key-card'
import PageHero from '@/components/page-hero'
import UsageSection from '@/components/usage-section'
import { GPG_KEYS } from '@/data/gpg-key'

export const metadata: Metadata = {
	title: 'GPG Keys - Robert Eggl',
	description:
		"Robert Eggl's GPG public key for secure communication and verification."
}

export default function Keys() {
	return (
		<div className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%)]"
			/>

			<div className="container-custom relative pb-24 pt-28 md:pt-36">
				<PageHero
					eyebrow="Trust"
					title="GPG key."
					description="Verify signatures and send encrypted messages. The fingerprint is the source of truth."
					action={
						<a
							href="/api/keys.asc"
							className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
							title="Download public key"
							aria-label="Download public key"
						>
							<Download size={15} strokeWidth={1.75} />
							Download
						</a>
					}
				/>

				<div className="space-y-16 md:space-y-20">
					{GPG_KEYS.map((keyInfo) => (
						<KeyCard key={keyInfo.id} keyInfo={keyInfo} />
					))}

					<section className="border-t border-line pt-16 md:pt-20">
						<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
							Guide
						</p>
						<h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
							How to use it.
						</h2>
						<div className="mt-8">
							<UsageSection />
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}
