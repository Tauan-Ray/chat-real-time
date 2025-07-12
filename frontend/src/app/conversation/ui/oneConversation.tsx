"use client"
import { useUser } from "@/contexts/user-context"
import type { ConversationProps } from "./allConversations"
import { formatMessageDate } from "@/lib/utils"

const OneConversation = ({ conversationId, name: ParticipantName, lastMessageContent, lastMessageDate, lastMessageSenderId }: ConversationProps) => {
    const user = useUser()
    const date = formatMessageDate(lastMessageDate)
    return (
        <div className="flex items-center justify-between bg-secondary rounded-md p-4 cursor-pointer hover:bg-hover transition">
            <div>
                <p className="text-lg font-semibold text-text-primary">{ParticipantName}</p>
                <p className="text-sm text-text-secondary">
                    {user?.id !== lastMessageSenderId ?
                    `${ParticipantName}: `
                    : `Você: `} {lastMessageContent}
                 </p>
            </div>
            <span className="text-sm text-text-secondary">{date}</span>
        </div>
    )
}

export default OneConversation