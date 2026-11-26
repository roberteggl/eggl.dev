import AgentChatTeaser from './agent-chat-teaser'

export default function AgentChat() {
	if (!process.env.OPENAI_API_KEY) {
		return null
	}

	return <AgentChatTeaser />
}
