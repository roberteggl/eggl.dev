import type { Metadata } from 'next'
import KeyCard from '@/components/keys/key-card'
import PageHero from '@/components/page-hero'
import UsageSection from '@/components/usage-section'
import { GPG_KEYS } from '@/data/gpg-key'

export const metadata: Metadata = {
	title: 'GPG Keys - Robert Eggl',
	description:
		"Robert Eggl's GPG public keys for secure communication and verification."
}

export default function Keys() {
	const activeKeys = GPG_KEYS.filter((key) => key.status === 'active')
	const replacedKeys = GPG_KEYS.filter((key) => key.status === 'replaced')

	return (
		<div className="container-custom max-w-5xl pb-24 pt-28 md:pt-36">
			<PageHero
				eyebrow="Trust"
				title="GPG keys."
				description="Verify signatures and send encrypted messages. Fingerprints are the source of truth."
			/>

			<div className="space-y-8">
				{activeKeys.map((keyInfo) => (
					<KeyCard key={keyInfo.id} keyInfo={keyInfo} />
				))}
			</div>

			{replacedKeys.length > 0 && (
				<section className="mt-20">
					<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						Archive
					</p>
					<h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
						Previous keys.
					</h2>
					<div className="mt-8 space-y-8 opacity-80">
						{replacedKeys.map((keyInfo) => (
							<KeyCard key={keyInfo.id} keyInfo={keyInfo} />
						))}
					</div>
				</section>
			)}

			<section className="mt-20">
				<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					Guide
				</p>
				<h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
					How to use them.
				</h2>
				<div className="mt-8">
					<UsageSection />
				</div>
			</section>
		</div>
	)
}
