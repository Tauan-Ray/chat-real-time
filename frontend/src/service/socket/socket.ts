import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      query: { userId }

    })
  }
  return socket
}
