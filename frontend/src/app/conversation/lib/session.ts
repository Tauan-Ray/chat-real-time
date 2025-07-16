'use server'

import 'server-only'
import { service_api } from '@/service/api/service.api';
import { handleApiError } from '@/lib/index';
import { ConversationProps } from '../ui/allConversations';

type GetConversationsResponse = {
  conversations: ConversationProps[]
  status: number
  message?: string
}


export async function getConversations(): Promise<GetConversationsResponse> {
  return service_api.get('/conversation/all-conversations')
    .then(({ data }) => {
      return {
        conversations: data,
        status: 200,
      }
    })
    .catch((error) => {
      const { status, message } = handleApiError(error)
      return {
        conversations: [],
        status,
        message,
      }
    })
}

export async function createConversation(participantId: string) {
  return service_api.post('/conversation/create-conversation', { participantId })
    .then(({ data, status }) => {
      return {
        status,
        message: data || 'Conversa criada com sucesso',
      }
    })
    .catch((error) => {
      const { status, message } = handleApiError(error)
      return { status, message }
    })
}
