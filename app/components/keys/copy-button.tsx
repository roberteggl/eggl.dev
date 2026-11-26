'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyButtonProps {
	text: string
	title?: string
	className?: string
}

export default function CopyButton({
	text,
	title = 'Copy to clipboard',
	className = ''
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`inline-flex items-center justify-center border border-line bg-background p-2 text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent ${className}`}
			title={title}
			aria-label={title}
		>
			{copied ? (
				<Check size={16} strokeWidth={1.75} />
			) : (
				<Copy size={16} strokeWidth={1.75} />
			)}
		</button>
	)
}
