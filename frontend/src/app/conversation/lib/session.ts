'use server'

import 'server-only'
import { service_api } from '@/service/api/service.api';
import { handleApiError } from '@/lib/index';

export type ConversationProps = {
  conversationId: string;
  lastMessageContent: string;
  lastMessageDate: string;
  name: string;
}


export async function getConversations(): Promise<ConversationProps[]> {
  return await service_api.get('/conversation/all-conversations')
    .then(({ data }) => (data))
    .catch(handleApiError)
}