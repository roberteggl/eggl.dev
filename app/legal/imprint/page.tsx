import type { Metadata } from 'next'
import SectionHeader from '@/components/section-header'
import imprintData from '@/data/imprint'

export const metadata: Metadata = {
	title: 'Imprint | Robert Eggl',
	description: 'Imprint page for Robert Eggl'
}

const Imprint = () => {
	const { contactInformation, legalInformation } = imprintData

	return (
		<div className="container-custom max-w-3xl pb-24 pt-28 md:pt-36">
			<SectionHeader
				number="01"
				eyebrow="Legal"
				title="Impressum."
				description="Angaben gemäß § 5 TMG."
			/>

			<h1 className="sr-only">Imprint - Robert Eggl</h1>

			<section className="mb-6">
				<h2 className="font-display text-2xl tracking-tight">
					{contactInformation.title}
				</h2>
				<div className="luxe-card mt-4 select-none p-6 md:p-8">
					<dl className="divide-y divide-line">
						{[
							['Name', contactInformation.name],
							['Address', contactInformation.address],
							['E-Mail', contactInformation.email],
							['Phone', contactInformation.phone]
						].map(([term, value]) => (
							<div key={term} className="flex gap-4 py-3 text-[15px]">
								<dt className="w-24 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground pt-0.5">
									{term}
								</dt>
								<dd className="text-foreground/90">{value}</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			<section>
				<h2 className="font-display text-2xl tracking-tight">
					Verantwortlich für den Inhalt
				</h2>
				<div className="luxe-card mt-4 select-none p-6 md:p-8">
					<p className="text-[15px] leading-relaxed text-foreground/85">
						{legalInformation.responsibleForContent}
					</p>
				</div>
			</section>
		</div>
	)
}

export default Imprint
