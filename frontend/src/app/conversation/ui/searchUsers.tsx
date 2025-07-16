"use client"

import { getUserByEmail } from "@/app/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { createConversation } from "../lib/session"
import { redirect } from "next/navigation"
import { useUser } from "@/contexts/user-context"

const SearchUser = () => {
  const [email, setEmail] = useState("")
  const user = useUser()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!email.trim()) return

    const res = await getUserByEmail(email)
    if (res.message) {
      toast.warning(res.message, {
        description: "Verifique o email e tente novamente."
      })
      return
    } else if (res.id === user.id) {
      toast.warning("Você não pode iniciar uma conversa com você mesmo", {
        description: "Por favor, insira um email diferente."
      })
      return
    }

    setEmail("")

    const conversation = await createConversation(res.id)
    const nameOtherParticipant = conversation.message.conversation.participants[0].user.name
    const urlConversation = `/conversation/${conversation.message.conversation.id}?name=${nameOtherParticipant}`

    redirect(urlConversation)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 mt-4"
      aria-label="Buscar usuário por email"
    >
      <Input
        type="email"
        placeholder="Buscar usuário pelo email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email do usuário"
      />
      <Button
        type="submit"
        disabled={!email.trim()}
      >
        Buscar
      </Button>
    </form>
  )
}

export default SearchUser
