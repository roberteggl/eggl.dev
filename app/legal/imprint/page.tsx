import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/page-hero'
import imprintData from '@/data/imprint'

export const metadata: Metadata = {
	title: 'Imprint | Robert Eggl',
	description: 'Imprint page for Robert Eggl'
}

const Imprint = () => {
	const { contactInformation, legalInformation } = imprintData

	const rows = [
		['Name', contactInformation.name],
		['Address', contactInformation.address],
		['E-Mail', contactInformation.email],
		['Phone', contactInformation.phone]
	] as const

	return (
		<div className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%)]"
			/>

			<div className="container-custom relative max-w-5xl pb-24 pt-28 md:pt-36">
				<PageHero
					eyebrow="Legal"
					title="Impressum."
					description="Angaben gemäß § 5 TMG."
					action={
						<Link
							href="/legal/privacy"
							className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
						>
							Privacy
						</Link>
					}
				/>

				<section>
					<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						01 · Contact
					</p>
					<h2 className="font-display text-2xl tracking-tight md:text-3xl">
						{contactInformation.title}
					</h2>
					<dl className="mt-8 space-y-6">
						{rows.map(([term, value]) => (
							<div key={term} className="flex gap-6 text-[15px] sm:gap-10">
								<dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:w-28">
									{term}
								</dt>
								<dd className="select-none leading-relaxed text-foreground/90">
									{value}
								</dd>
							</div>
						))}
					</dl>
				</section>

				<section className="mt-16 border-t border-line pt-12 md:mt-20 md:pt-16">
					<p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						02 · Responsibility
					</p>
					<h2 className="font-display text-2xl tracking-tight md:text-3xl">
						Verantwortlich für den Inhalt
					</h2>
					<p className="mt-6 max-w-2xl select-none text-[15px] leading-relaxed text-foreground/85 md:text-base">
						{legalInformation.responsibleForContent}
					</p>
				</section>
			</div>
		</div>
	)
}

export default Imprint
