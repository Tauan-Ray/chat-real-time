import { PrismaService } from '@infra/database/prisma.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../message/schema/message.schema';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import { MessageSocketService } from '../message/message-socket.service';


@Injectable()
export class ConversationService {
    constructor(
        private prisma: PrismaService,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
        @Inject('REDIS_CLIENT')
        private redisService: Redis,
        private messageSocketService: MessageSocketService
    ) {}

    async getConversations(userId: string, page = 1, pageSize = 10) {
        const conversations = await this.prisma.conversationUser.findMany({
            where: {
                userId,
                deletedAt: null,
                conversation: { lastMessageId : { not: null } }
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { conversation: { lastMessageDate: 'desc' },
            },
            include: {
                conversation: {
                    include: {
                        participants: {
                            where: { userId: { not: userId } },
                            select: { user: { select: { id:true, name: true } } }
                        },
                    },
                },
            },
        })

        type LastMessage = {
            content: string
            senderId: string
            createdAt: Date
            messageId: string
        }

        const lastMessages = await Promise.all(
            conversations.map(async (c) => {
            const cached = await this.redisService.get(`lastMessage:${c.conversationId}`)
            let lastMessage: LastMessage | null = cached ? JSON.parse(cached) : null

            if (!lastMessage && c.conversation.lastMessageId) {
                const message = await this.messageModel.findById(c.conversation.lastMessageId).lean()

                if (message) {
                    lastMessage = {
                        content: message.content,
                        senderId: message.senderId,
                        createdAt: message.createdAt,
                        messageId: message._id.toString(),
                    }

                    await this.redisService.set(
                        `lastMessage:${c.conversationId}`,
                        JSON.stringify(lastMessage)
                    )
                }
            }

            return lastMessage
            })
        )

        return conversations.map((c, index) => {
            const lastMessage = lastMessages[index]

            return {
                conversationId: c.conversationId,
                lastMessageContent: lastMessage?.content || null,
                lastMessageDate: c.conversation.lastMessageDate,
                name: c.conversation.participants[0]?.user.name || 'Desconhecido',
                lastMessageSenderId:  lastMessage ? lastMessage.senderId : null
            }
        })
    }

    async createConversation(userId: string, otherParticipantId: string) {
        if (userId === otherParticipantId) {
            throw new UnauthorizedException('Não é possível criar uma conversa consigo mesmo')
        }

        const conversation = await this.prisma.conversationUser.findFirst({
            where: {
                userId: userId,
                deletedAt: null,
                conversation: {
                    participants: {
                        some: {
                            userId: otherParticipantId,
                            deletedAt: null,
                        },
                    },
                },
            },
            select: {
                conversation: {
                    select: {
                        id: true,
                        createdAt: true,
                        participants: {
                            where: { userId: { not: userId } },
                            select: { user: { select: { id: true, name: true } } }
                        }
                    }
                }
            }
        })

        if (conversation) {
            return conversation
        }

        const newConversation = await this.prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: userId },
                        { userId: otherParticipantId },
                    ],
                },
            },
            select: {
                id: true,
                createdAt: true,
                participants: {
                    where: { userId: { not: userId } },
                    select: { user: { select: { id: true, name: true } } }
                }
            }
        })
        this.messageSocketService.emitNewConversation(otherParticipantId, {
            conversationId: newConversation.id
        })

        return { conversation: newConversation }

    }

    async updateConversation(userId: string, conversationId: string, lastMessageId: string, lastMessageDate: Date) {
        const participation = await this.prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId,
                deletedAt: null,
            },
        });

        if (!participation) {
            throw new UnauthorizedException('Usuário não participa dessa conversa')
        }

        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessageDate,
                lastMessageId
            }
        })
    }

    async deleteConversation(userId: string, conversationId: string,) {
        await this.prisma.conversationUser.updateMany({
            where: {
                conversationId,
                userId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return { message: "Conversa deletada com sucesso" }
    }

}
