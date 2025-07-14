'use server'

import 'server-only'
import { service_api } from '@/service/api/service.api';
import { handleApiError } from '@/lib/index';

export type getMessagesProps = {
    content: string;
    conversationId: string;
    createdAt: string;
    deletedAt: string;
    readBy: [];
    senderId: string;
    updatedAt: string;
    __v: number
    _id: string
}

type getMessagesResponse = {
    messages: getMessagesProps[],
    status: number;
    message?: string;
}

export async function getMessages(conversationId: string, page = 1): Promise<getMessagesResponse> {
  return service_api.get(`/message/get-messages/${conversationId}?page=${page}`)
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      const { status, message } = handleApiError(error)
      return {
        messages: [],
        page: 1,
        pageLimit: 10,
      }
    })
}

export async function createMessage(conversationId: string, content: string) {
  return service_api.post('/message/create-message', {
    conversationId,
    content
  })
    .then(({ data }) => {
      return {
        status: 200,
        message: 'Mensagem enviada com sucesso',
        data
      }
    })
    .catch((error) => {
      const { status, message } = handleApiError(error)
      return {
        status,
        message,
        data: []
      }
  })

}