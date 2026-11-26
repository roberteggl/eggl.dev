/**
 * Custom hook for smooth scrolling to element IDs
 * Can be used both for in-page hash links and with router state
 */
export const useSmoothScroll = () => {
	/**
	 * Smoothly scroll to an element by ID
	 * @param {string} id - The ID of the element to scroll to
	 * @param {ScrollIntoViewOptions} options - Scroll options
	 */
	const scrollToElement = (
		id: string,
		options: ScrollIntoViewOptions = { behavior: 'smooth' as const }
	) => {
		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView(options)
		}
	}

	/**
	 * Handle click on hash link with smooth scrolling
	 * @param {Event} e - The click event
	 * @param {string} id - The ID of the element to scroll to
	 */
	const handleHashLinkClick = (
		e: { preventDefault: () => void },
		id: string
	) => {
		e.preventDefault()
		scrollToElement(id)
		const nextHash = `#${id}`
		if (window.location.hash !== nextHash) {
			window.history.replaceState(null, '', nextHash)
			window.dispatchEvent(new Event('hashchange'))
		}
	}

	return {
		scrollToElement,
		handleHashLinkClick
	}
}

export default useSmoothScroll
