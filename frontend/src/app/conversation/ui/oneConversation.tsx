import type { ConversationProps } from "./allConversations"

const OneConversation = ({ conversationId, name, lastMessageContent, lastMessageDate }: ConversationProps) => {
    const date = new Date(lastMessageDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    return (
        <div className="flex items-center justify-between bg-secondary rounded-md p-4 cursor-pointer hover:bg-hover transition">
            <div>
                <p className="text-lg font-semibold text-text-primary">{name}</p>
                <p className="text-sm text-text-secondary">{lastMessageContent}</p>
            </div>
            <span className="text-sm text-text-secondary">{date}</span>
        </div>
    )
}

export default OneConversation