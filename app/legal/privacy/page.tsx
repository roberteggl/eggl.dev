import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/page-hero'
import imprintData from '@/data/imprint'

export const metadata: Metadata = {
	title: 'Privacy | Robert Eggl',
	description: 'Privacy page for Robert Eggl'
}

const Privacy = () => {
	return (
		<div className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,212,191,0.08),transparent_55%)]"
			/>

			<div className="container-custom relative max-w-5xl pb-24 pt-28 md:pt-36">
				<PageHero
					eyebrow="Legal"
					title="Datenschutzerklärung."
					description="Hinweise zum Umgang mit personenbezogenen Daten auf dieser Website."
					action={
						<Link
							href="/legal/imprint"
							className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
						>
							Imprint
						</Link>
					}
				/>

				<p className="mb-12 max-w-3xl font-mono text-[13px] leading-relaxed text-muted-foreground md:mb-16">
					Die Datenschutzerklärung ist auf Deutsch verfasst, da sie den
					rechtlichen Anforderungen des Wohnsitzlandes entspricht und keine
					kommerzielle Absicht besteht. Die übrigen Inhalte sind auf Englisch
					gehalten, um dem internationalen Standard gerecht zu werden.
				</p>

				<div className="legalsection max-w-none">
					<h2>Verantwortliche Stelle</h2>
					<p>
						Robert Eggl
						<br />
						{imprintData.contactInformation.address}
						<br />
						E-Mail: {imprintData.contactInformation.email}
						<br />
						Telefon: {imprintData.contactInformation.phone}
					</p>

					<h2>Welche Daten wir verarbeiten</h2>
					<p>
						Beim Besuch der Website fallen technische Verbindungsdaten an
						(z.&nbsp;B. IP-Adresse, Browser, Betriebssystem, Referrer,
						Zeitstempel). Diese Server-Log-Dateien werden nicht mit anderen
						Datenquellen zusammengeführt.
					</p>
					<p>
						Wenn Sie uns per E-Mail, Telefon oder über den optionalen Eggl Agent
						kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Inhalte
						sowie die dafür nötigen technischen Daten.
					</p>

					<h2>Zwecke der Verarbeitung</h2>
					<p>
						Die Daten dienen dem Betrieb und der Absicherung der Website, der
						Beantwortung von Anfragen sowie (sofern genutzt) dem optionalen
						KI-Chat zum Portfolio. Eine Nutzung der Kontaktdaten für Werbung
						oder Adresshandel widerspreche ich ausdrücklich.
					</p>

					<h2>Rechtsgrundlagen</h2>
					<p>
						Die Verarbeitung erfolgt auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1
						lit.&nbsp;b DSGVO (Anfragen mit Vertragsbezug), Art.&nbsp;6
						Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse an Betrieb,
						Sicherheit und einer hilfreichen Portfolio-Darstellung) sowie, soweit
						eine Einwilligung eingeholt wurde, Art.&nbsp;6 Abs.&nbsp;1
						lit.&nbsp;a DSGVO. Eine Einwilligung ist jederzeit widerrufbar.
					</p>

					<h2>Hosting (Vercel)</h2>
					<p>
						Die Website wird über Vercel Inc., 440 N Barranca Ave #4133, Covina,
						CA 91723, USA, bereitgestellt. Dabei können technische
						Verbindungsdaten an Vercel übermittelt und in den USA verarbeitet
						werden. Details:{' '}
						<a
							href="https://vercel.com/legal/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
						>
							Vercel Privacy Policy
						</a>
						. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.
					</p>

					<h2>Eggl Agent (KI-Chat)</h2>
					<p>
						Sofern der Eggl Agent eingeblendet ist, können Sie optional Fragen
						zu Projekten, Blogbeiträgen, öffentlichen Profilen und Kontakt
						stellen. Ohne Nutzung werden keine Chatnachrichten übermittelt.
					</p>
					<p>
						Beim Senden einer Nachricht werden Nachrichteninhalt, ggf. der
						bisherige Chatverlauf dieser Sitzung (nur im Browser) sowie
						technische Verbindungsdaten (insbesondere IP-Adresse zur
						Missbrauchsprävention) an unseren Server und zur Antwortgenerierung
						an OpenAI, Inc. (USA) weitergegeben. Der Agent darf nur festgelegte
						Funktionen auf Inhalte dieser Website bzw. öffentliche
						GitHub-Statistiken nutzen.
					</p>
					<p>
						Chatverläufe speichern wir nicht dauerhaft; sie verbleiben, soweit
						überhaupt, lokal im Browser. Antworten werden bei OpenAI nicht über
						einen Response-Store dauerhaft abgelegt; die Übermittlung dient der
						Antwortgenerierung. Kurzzeitig können technische Logdaten und
						IP-bezogene Rate-Limit-Zähler anfallen. Bitte keine Passwörter,
						API-Schlüssel oder sonstigen Geheimnisse eingeben. Eine Übermittlung
						in die USA kann erfolgen. Weitere Informationen:{' '}
						<a
							href="https://openai.com/policies/privacy-policy"
							target="_blank"
							rel="noopener noreferrer"
						>
							OpenAI Privacy Policy
						</a>
						. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.
					</p>

					<h2>Speicherdauer</h2>
					<p>
						Personenbezogene Daten werden nur so lange gespeichert, wie es für
						den jeweiligen Zweck erforderlich ist oder gesetzliche Fristen
						greifen. Danach werden sie gelöscht oder überschrieben.
					</p>

					<h2>Ihre Rechte</h2>
					<p>
						Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
						Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
						Widerspruch gegen eine Verarbeitung auf Grundlage von Art.&nbsp;6
						Abs.&nbsp;1 lit.&nbsp;f DSGVO. Außerdem besteht ein Beschwerderecht
						bei der zuständigen Aufsichtsbehörde. Für Anfragen nutzen Sie bitte
						die Kontaktadresse oben.
					</p>
					<p>
						Diese Seite nutzt TLS-Verschlüsselung. Eine verschlüsselte
						Verbindung erkennen Sie am „https://“ in der Adresszeile.
					</p>
				</div>
			</div>
		</div>
	)
}

export default Privacy
