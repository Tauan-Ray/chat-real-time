"use client"

import { useEffect, useState } from "react"
import OneConversation from "./oneConversation"
import { getConversations } from "../lib/session"
import { MessageCircleOff } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSocketEvent } from "@/hooks/use-socket-event"

export type ConversationProps = {
  name: string;
  lastMessageSenderId: string;
  conversationId: string;
  lastMessageContent: string;
  lastMessageDate: string;
}

const AllConversation = () => {
  const [conversations, setConversations] = useState<ConversationProps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true)

      const res = await getConversations()
      res.status !== 200 ? setConversations([]) : setConversations(res.conversations)

      setIsLoading(false)
    }
    fetchConversations()
  }, [])

  useSocketEvent("receive_new_last_message", (message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.conversationId === message.conversationId
          ? {
              ...conv,
              lastMessageContent: message.content,
              lastMessageSenderId: message.senderId,
            }
          : conv
      )
    )
    // # Analisar depois: Forma de mostrar notificação de novas mensagens
      // if (message.senderId !== user?.id) {
      //   toast.info(`Nova mensagem: ${message.participantName}`, {
      //     description: message.content
      //   })
      // }
  })

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-between bg-secondary rounded-md p-4 animate-pulse">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40 rounded-md bg-border" />
            <Skeleton className="h-4 w-60 rounded-md bg-border" />
          </div>
          <Skeleton className="h-4 w-12 rounded-md bg-border" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
          <MessageCircleOff size={48} className="mb-4" />
          <p className="text-lg font-medium">Você ainda não tem conversas iniciadas.</p>
          <p className="text-sm mt-1">Comece uma conversa para vê-la listada aqui.</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <OneConversation
            key={conversation.conversationId}
            conversationId={conversation.conversationId}
            name={conversation.name}
            lastMessageContent={conversation.lastMessageContent}
            lastMessageDate={conversation.lastMessageDate}
            lastMessageSenderId={conversation.lastMessageSenderId}
          />
        ))
      )}
    </div>
  )
}

export default AllConversation
