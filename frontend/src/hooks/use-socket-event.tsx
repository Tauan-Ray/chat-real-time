import { useEffect } from "react"
import { getSocket } from "@/service/socket/socket"
import { useUser } from "@/contexts/user-context"

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const user = useUser()
  useEffect(() => {
    if (!user) return

    const socket = getSocket(user.id)
    socket.on(event, callback)

    return () => {
      socket.off(event, callback)
    }
  }, [event, callback, user])
}
