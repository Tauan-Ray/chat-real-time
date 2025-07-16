"use client"

import { useEffect, useState } from "react";
import OneConversation from "./oneConversation";
import { getConversations } from "../lib/session";
import { MessageCircleOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocketEvent } from "@/hooks/use-socket-event";
import SearchUser from "./searchUsers";
import { getSocket } from "@/service/socket/socket";
import { useUser } from "@/contexts/user-context";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const user = useUser()

  useEffect(() => {
    if (!user) return
    const fetchConversations = async () => {
      setIsLoading(true)

      const res = await getConversations()

      if (res.status === 200) {
        setConversations(res.conversations)

        const socket = getSocket(user.id)
        res.conversations.forEach((conv) => {
          socket.emit("joinConversation", conv.conversationId)
        });
      } else {
        setConversations([])
      }

      setIsLoading(false)
    };
    fetchConversations()
  }, [user])

  useSocketEvent("receive_new_last_message", (message) => {
    console.log("Nova mensagem recebida:", message)
    setConversations((prev) => {
      if (prev.some((conv) => conv.conversationId === message.conversationId)) {
        return prev.map((conv) =>
          conv.conversationId === message.conversationId
            ? {
                ...conv,
                lastMessageContent: message.content,
                lastMessageSenderId: message.senderId,
                lastMessageDate: message.createdAt,
              }
            : conv
        )
      }
      return [
        {
          conversationId: message.conversationId,
          lastMessageContent: message.content,
          lastMessageSenderId: message.senderId,
          lastMessageDate: message.createdAt,
          name: message.participantName,
        },
        ...prev,
      ]
    })

    toast.custom((t) => (
      <div className="w-full max-w-md mx-auto bg-surface border border-border text-text-primary px-5 py-4 rounded-xl shadow-lg flex items-start space-x-4 animate-fadeIn">
        <div className="flex-1 text-sm">
          <p className="text-base font-semibold mb-1">
            Nova mensagem de {message.participantName}
          </p>
          <p className="text-text-secondary text-sm">
            {message.content.length > 40
              ? message.content.slice(0, 40) + "..."
              : message.content}
          </p>
        </div>
        <Button
          onClick={() => {
            toast.dismiss(t)
            redirect(`/conversation/${message.conversationId}?name=${message.participantName}`)
          }}
        >
          Abrir
        </Button>
      </div>
    ))

  })

  useSocketEvent("newConversationCreated", (data) => {
    if (!user) return

    const socket = getSocket(user?.id)
    socket.emit("joinConversation", data.conversationId)
  })

  return (
    <div className="space-y-4">
      <SearchUser />

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
          <p className="text-lg font-medium">
            Você ainda não tem conversas iniciadas.
          </p>
          <p className="text-sm mt-1">
            Comece uma conversa para vê-la listada aqui.
          </p>
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
