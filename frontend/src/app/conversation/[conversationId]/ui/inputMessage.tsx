"use client"
import { useState } from "react"
import { createMessage } from "../lib/session"
import { toast } from "sonner"
import { getSocket } from "@/service/socket/socket"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"

export const InputMessage = ({ conversationId }: { conversationId: string }) => {
    const [message, setMessage] = useState("")
    const user = useUser()

    const handleSubmitMessage =  async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (message.trim() === "") return

        const res = await createMessage(conversationId, message)
        if (res.status !== 200) {
            toast.error("Erro ao enviar a mensagem", {
                description: res.message || "Tente novamente mais tarde"
            })
        }

        setMessage("")

        const socket = getSocket(user.id)

        socket.emit("sendMessage", res.data)
    }

    return (
        <footer className="bg-surface p-4 border-t border-border flex gap-2">
            <form onSubmit={handleSubmitMessage} className="flex items-center gap-2 w-full">
                <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-secondary text-text-primary p-2 rounded-md outline-none"
                />
                <Button className="bg-primary-dark text-white px-4 py-2 rounded-md p-5" onClick={handleSubmitMessage} type="submit">Enviar</Button>
            </form>
        </footer>
    )
}

export default InputMessage