export interface GitHubData {
	contributions: { date: string; count: number }[]
	stats: {
		followers: number
		stars: number
		contributions: number
		pullRequests: number
		topLanguages: string[]
	}
}

let cachedGitHubData: GitHubData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 10 * 60 * 1000

export async function getGitHubData(): Promise<GitHubData> {
	const now = Date.now()
	if (cachedGitHubData && now - lastFetchTime < CACHE_DURATION) {
		return cachedGitHubData
	}

	const GITHUB_STATS_TOKEN = process.env.GITHUB_STATS_TOKEN || ''

	if (!GITHUB_STATS_TOKEN) {
		console.warn('No GitHub token provided, returning empty data')
		return {
			contributions: [],
			stats: {
				followers: 0,
				stars: 0,
				contributions: 0,
				pullRequests: 0,
				topLanguages: []
			}
		}
	}

	const NEULAND_REPOS = [
		'neuland.app-native',
		'neuland.app-backend',
		'neuland-website',
		'campus-life-events',
		'member-id',
		'neuland-connect',
		'neuland.app-docs',
		'neuland-dashboard',
		'app-backend-core',
		'app-backend-contracts',
		'hr-portal'
	]
	const GITHUB_USERNAME = 'roberteggl'

	const SIZE_WEIGHT = 0.5
	const COUNT_WEIGHT = 0.5

	const IGNORED_LANGUAGES = new Set([
		'HTML',
		'CSS',
		'Dockerfile',
		'SCSS',
		'JSON',
		'YAML',
		'XML',
		'Markdown',
		'Shell',
		'Ruby',
		'Jupyter Notebook',
		'PLpgSQL'
	])

	const gql = async (query: string) => {
		const res = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${GITHUB_STATS_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		})

		if (!res.ok) {
			const errorText = await res.text()
			console.error(
				`GitHub API error: ${res.status} ${res.statusText}`,
				errorText
			)
			throw new Error(
				`GitHub API request failed: ${res.status} ${res.statusText}`
			)
		}

		const data = await res.json()

		if (data.errors) {
			console.error('GitHub GraphQL errors:', data.errors)
			throw new Error(
				`GitHub GraphQL errors: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`
			)
		}

		return data
	}

	const repoFragments = NEULAND_REPOS.map(
		(repo, index) => `
    repo${index}: repository(owner: "neuland-ingolstadt", name: "${repo}") {
      stargazerCount
      languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
        edges {
          size
          node {
            name
          }
        }
      }
    }
  `
	).join('\n')

	const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        repositories(first: 100, isFork: false, ownerAffiliations: OWNER) {
          nodes {
            stargazerCount
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
        followers {
          totalCount
        }
        pullRequests {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
      ${repoFragments}
    }
  `

	try {
		const data = await gql(query)

		const repos = data.data.user.repositories.nodes
		const personalStars = repos.reduce(
			(sum: number, r: { stargazerCount: number }) => sum + r.stargazerCount,
			0
		)

		let orgStars = 0

		const languageByteCounts = new Map<string, number>()
		const languageRepoCounts = new Map<string, number>()

		repos.forEach(
			(repo: {
				languages: { edges: { node: { name: string }; size: number }[] }
			}) => {
				const repoLanguages = new Set<string>()

				if (repo.languages?.edges) {
					repo.languages.edges.forEach((edge) => {
						const name = edge.node.name

						if (IGNORED_LANGUAGES.has(name)) return

						const size = edge.size || 0

						const currentBytes = languageByteCounts.get(name) || 0
						languageByteCounts.set(name, currentBytes + size)

						repoLanguages.add(name)
					})
				}

				repoLanguages.forEach((lang) => {
					if (IGNORED_LANGUAGES.has(lang)) return

					const currentCount = languageRepoCounts.get(lang) || 0
					languageRepoCounts.set(lang, currentCount + 1)
				})
			}
		)

		NEULAND_REPOS.forEach((_, index) => {
			const repoData = data.data[`repo${index}`]
			if (repoData) {
				orgStars += repoData.stargazerCount || 0

				const repoLanguages = new Set<string>()

				if (repoData.languages?.edges) {
					repoData.languages.edges.forEach(
						(edge: { node: { name: string }; size: number }) => {
							const name = edge.node.name

							if (IGNORED_LANGUAGES.has(name)) return

							const size = edge.size || 0

							const currentBytes = languageByteCounts.get(name) || 0
							languageByteCounts.set(name, currentBytes + size * 1.5)

							repoLanguages.add(name)
						}
					)
				}

				repoLanguages.forEach((lang) => {
					if (IGNORED_LANGUAGES.has(lang)) return

					const currentCount = languageRepoCounts.get(lang) || 0
					languageRepoCounts.set(lang, currentCount + 1.5)
				})
			}
		})

		const languageScores = new Map<string, number>()

		const allLanguages = new Set([
			...languageByteCounts.keys(),
			...languageRepoCounts.keys()
		])

		allLanguages.forEach((lang) => {
			if (IGNORED_LANGUAGES.has(lang)) return

			const byteCount = languageByteCounts.get(lang) || 0
			const repoCount = languageRepoCounts.get(lang) || 0

			const score = byteCount ** SIZE_WEIGHT * repoCount ** COUNT_WEIGHT
			languageScores.set(lang, score)
		})

		const topLanguages = [...languageScores.entries()]
			.sort((a, b) => b[1] - a[1])
			.map((entry) => entry[0])
			.slice(0, 6)

		const pullRequests = data.data.user.pullRequests.totalCount
		const contributions =
			data.data.user.contributionsCollection.contributionCalendar
				.totalContributions

		const contributionDays =
			data.data.user.contributionsCollection.contributionCalendar.weeks
				.flatMap(
					(week: {
						contributionDays: { date: string; contributionCount: number }[]
					}) => week.contributionDays
				)
				.map((day: { date: string; contributionCount: number }) => ({
					date: day.date,
					count: day.contributionCount
				}))

		const result = {
			contributions: contributionDays,
			stats: {
				followers: data.data.user.followers.totalCount,
				stars: personalStars + orgStars,
				contributions,
				pullRequests,
				topLanguages
			}
		}

		cachedGitHubData = result
		lastFetchTime = now

		return result
	} catch (error) {
		console.error('Error fetching GitHub GraphQL data:', error)

		throw new Error(
			`Failed to fetch GitHub data: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

export const getContributionColor = (count: number): string => {
	if (count === 0) return 'bg-surface-2'
	if (count < 3) return 'bg-accent/30'
	if (count < 6) return 'bg-accent/60'
	if (count < 10) return 'bg-accent/85'
	return 'bg-accent'
}

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}
