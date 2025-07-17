"use client"

import { useParams, useSearchParams } from "next/navigation"
import HeaderChat from "./ui/headerChat"
import AllMessages from "./ui/allMessages"
import InputMessage from "./ui/inputMessage"
import { getSocket } from "@/service/socket/socket"
import { useEffect } from "react"
import { useUser } from "@/contexts/user-context"

const ChatConversationPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const user = useUser()

  const conversationId = params.conversationId as string | undefined
  const participantName = searchParams.get("name") || "Usuário"

  useEffect(() => {
    if (!user) return
    const socket = getSocket(user.id)
    socket.emit('joinConversation', conversationId)
  }, [conversationId, user])

  if (!conversationId) return <div />

  return (
    <div className="min-h-screen flex justify-center items-center bg-background text-text-primary">
      <div className="flex flex-col w-full max-w-6xl h-screen md:h-[90vh] bg-surface rounded-lg overflow-hidden shadow-lg">
        <HeaderChat participantName={participantName} />
        <main className="flex flex-col flex-1 overflow-hidden p-4 space-y-3">
          <AllMessages conversationId={conversationId} />
        </main>
        <InputMessage conversationId={conversationId} />
      </div>
    </div>
  )
}

export default ChatConversationPage
