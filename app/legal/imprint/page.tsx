import type { Metadata } from 'next'
import PageHero from '@/components/page-hero'
import imprintData from '@/data/imprint'

export const metadata: Metadata = {
	title: 'Imprint | Robert Eggl',
	description: 'Imprint page for Robert Eggl'
}

const Imprint = () => {
	const { contactInformation, legalInformation } = imprintData

	return (
		<div className="container-custom max-w-3xl pb-24 pt-28 md:pt-36">
			<PageHero
				eyebrow="Legal"
				title="Impressum."
				description="Angaben gemäß § 5 TMG."
			/>

			<section className="mb-10">
				<h2 className="font-display text-2xl tracking-tight">
					{contactInformation.title}
				</h2>
				<div className="mt-4 border border-line bg-surface p-6 md:p-8">
					<dl className="divide-y divide-line">
						{[
							['Name', contactInformation.name],
							['Address', contactInformation.address],
							['E-Mail', contactInformation.email],
							['Phone', contactInformation.phone]
						].map(([term, value]) => (
							<div key={term} className="flex gap-4 py-3 text-[15px]">
								<dt className="w-24 shrink-0 pt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
									{term}
								</dt>
								<dd className="select-none text-foreground/90">{value}</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			<section>
				<h2 className="font-display text-2xl tracking-tight">
					Verantwortlich für den Inhalt
				</h2>
				<div className="mt-4 border border-line bg-surface p-6 md:p-8">
					<p className="select-none text-[15px] leading-relaxed text-foreground/85">
						{legalInformation.responsibleForContent}
					</p>
				</div>
			</section>
		</div>
	)
}

export default Imprint
