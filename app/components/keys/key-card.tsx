import KeyInfoSection from '@/components/keys/key-info-section'
import KeyPreviewSection from '@/components/keys/key-preview-section'
import type { GPGKeyInfo } from '@/data/gpg-key'

interface KeyCardProps {
	keyInfo: GPGKeyInfo
	className?: string
}

export default function KeyCard({ keyInfo, className = '' }: KeyCardProps) {
	return (
		<div
			className={`grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20 ${className}`}
		>
			<KeyInfoSection keyInfo={keyInfo} />
			<KeyPreviewSection keyContent={keyInfo.key} />
		</div>
	)
}
