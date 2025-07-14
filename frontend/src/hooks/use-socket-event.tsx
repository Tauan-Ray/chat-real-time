import { useEffect } from "react"
import { getSocket } from "@/service/socket/socket"

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    const socket = getSocket()
    socket.on(event, callback)

    return () => {
      socket.off(event, callback)
    }
  }, [event, callback])
}
