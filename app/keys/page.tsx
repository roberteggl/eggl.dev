import type { Metadata } from 'next'
import KeyCard from '@/components/keys/key-card'
import SectionHeader from '@/components/section-header'
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
		<main className="container-custom max-w-5xl pb-24 pt-28 md:pt-36">
			<SectionHeader
				number="01"
				eyebrow="Trust"
				title="GPG keys."
				description="Verify signatures and send encrypted messages. Fingerprints are the source of truth."
			/>

			<h1 className="sr-only">GPG Keys - Robert Eggl</h1>

			<div className="space-y-8">
				{activeKeys.map((keyInfo) => (
					<KeyCard key={keyInfo.id} keyInfo={keyInfo} />
				))}
			</div>

			{replacedKeys.length > 0 && (
				<>
					<SectionHeader
						number="02"
						eyebrow="Archive"
						title="Previous keys."
						mbSize="mb-8 mt-20"
					/>
					<div className="space-y-8 opacity-80">
						{replacedKeys.map((keyInfo) => (
							<KeyCard key={keyInfo.id} keyInfo={keyInfo} />
						))}
					</div>
				</>
			)}

			<SectionHeader
				number="03"
				eyebrow="Guide"
				title="How to use them."
				mbSize="mb-8 mt-20"
			/>
			<UsageSection />
		</main>
	)
}
