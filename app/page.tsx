import { allBlogs } from 'content-collections'
import { JsonLd } from '@/components/json-ld'
import SectionIndex from '@/components/section-index'
import AboutSection from '@/components/sections/about-section'
import CareerSection from '@/components/sections/career-section'
import ContactSection from '@/components/sections/contact-section'
import EducationSection from '@/components/sections/education-section'
import HeroSection from '@/components/sections/hero-section'
import ProjectsSection from '@/components/sections/projects-section'
import SoftPage from '@/components/soft-page'
import Ticker from '@/components/ticker'
import { getGitHubData } from '@/lib/github'
import { createProfilePageJsonLd } from '@/lib/structured-data'

export default async function HomePage() {
	const TICKER_ITEMS = [
		'Full-Stack Development',
		'SAP',
		'Open Source',
		'AI Agents',
		'Enterprise Software',
		'Cloud Engineering'
	]

	const posts = allBlogs.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	)
	const latestPostDate =
		posts[0]?.date ?? new Date().toISOString().split('T')[0]

	let followers = 0
	let stars = 0

	try {
		const githubData = await getGitHubData()
		followers = githubData.stats.followers
		stars = githubData.stats.stars
	} catch {
		// GitHub stats are optional for structured data.
	}

	const profilePageJsonLd = createProfilePageJsonLd({
		dateModified: latestPostDate,
		recentPosts: posts.slice(0, 5).map((post) => ({
			title: post.title,
			slug: post.slug,
			date: post.date
		})),
		followers,
		stars,
		blogPostCount: posts.length
	})

	return (
		<>
			<SoftPage />
			<JsonLd data={profilePageJsonLd} />
			<SectionIndex />
			<HeroSection />
			<Ticker items={TICKER_ITEMS} />
			<ProjectsSection />
			<AboutSection />
			<EducationSection />
			<CareerSection />
			<ContactSection />
		</>
	)
}
