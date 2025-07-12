import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatMessageDate(dateString: string) {
  const messageDate = new Date(dateString)
  const now = new Date()
  const diffMm = now.getTime() - messageDate.getTime()
  const diffDays = Math.floor(diffMm / 86400000)

  if (diffDays === 0) {
    return messageDate.toLocaleTimeString("pt-BR", {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffDays === 1) {
    return "ontem"
  } else {
    return messageDate.toLocaleDateString("pt-BR")
  }
}