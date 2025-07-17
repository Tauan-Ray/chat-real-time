"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getMessages, getMessagesProps } from "../lib/session"
import { useUser } from "@/contexts/user-context"
import { useSocketEvent } from "@/hooks/use-socket-event"
import OneMessage from "./oneMessage"
import { getSocket } from "@/service/socket/socket"

const AllMessages = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<getMessagesProps[]>([])
  const [hasMore, setHasMore] = useState(true)
  const user = useUser()

  const containerRef = useRef<HTMLDivElement>(null)
  const currentPageRef = useRef(1)
  const prevCount = useRef(0)
  const isLoadingRef = useRef(false)

  const fetchMessages = useCallback(async (page: number) => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    const container = containerRef.current
    const oldScrollHeight = container?.scrollHeight ?? 0

    const res = await getMessages(conversationId, page)
    if (res.messages.length === 0) {
      setHasMore(false)
      isLoadingRef.current = false
      return
    }

    setMessages((prev) => {
      const newMessages = res.messages.filter((m) => !prev.some((p) => p._id === m._id))
      return page === 1 ? res.messages : [...prev, ...newMessages]
    })

    currentPageRef.current = page

    setTimeout(() => {
      if (page === 1) {
        scrollToBottom("instant")
      } else if (container) {
        container.scrollTop = container.scrollHeight - oldScrollHeight
      }
    }, 0)

    isLoadingRef.current = false
  }, [conversationId])


  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior })
  }


  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || !hasMore) return
    if (container.scrollTop <= 20) fetchMessages(currentPageRef.current + 1)
  }, [hasMore, fetchMessages])


  useEffect(() => {
    setHasMore(true)
    currentPageRef.current = 1
    fetchMessages(1)
  }, [conversationId, fetchMessages])

  useEffect(() => {
    if (!user) return

    const socket = getSocket(user.id)

    const unreadMessages = messages.filter(
      (msg) => !msg.readBy.includes(user.id) && msg.senderId !== user.id
    )

    unreadMessages.forEach((msg) => {
      socket.emit("markAsRead", {
        messageId: msg._id,
        userId: user.id,
        conversationId
      })
    })

  },[user, messages, conversationId])


  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 300

    if (isNearBottom) {
      setTimeout(() => scrollToBottom(), 0)
    }
    prevCount.current = messages.length
  }, [messages])


  useSocketEvent("receiveMessage", (data) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === data._id)) {
        return prev;
      }
      return [data, ...prev];
    });
  });

  useSocketEvent('messageRead', (data) => {
    setMessages(prev =>
      prev.map(msg =>
        msg._id === data.messageId && !msg.readBy.includes(data.userId)
          ? { ...msg, readBy: [...msg.readBy, data.userId] }
          : msg
      )
    );
  });


  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 scrollbar-hide"
    >
      {messages.slice().reverse().map((m) => (
        <OneMessage
          key={m._id}
          id={m._id}
          content={m.content}
          date={m.createdAt}
          deletedAt={m.deletedAt}
          owner={m.senderId === user?.id ? "me" : "other"}
          readBy={m.readBy}
        />
      ))}
    </div>
  )
}

export default AllMessages
