import { PrismaService } from '@infra/database/prisma.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../message/schema/message.schema';
import { Model } from 'mongoose';
import { RedisService } from '@infra/cache/redis.service';
import Redis from 'ioredis';


@Injectable()
export class ConversationService {
    constructor(
        private prisma: PrismaService,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
        @Inject('REDIS_CLIENT')
        private redisService: Redis
    ) {}

    async getConversations(userId: string, page = 1, pageSize = 10) {
        const conversations = await this.prisma.conversationUser.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                conversation: {
                    lastMessageDate: 'desc',
                },
            },
            include: {
                conversation: {
                    include: {
                        participants: {
                            where: { userId: { not: userId } },
                            select: { user: { select: { name: true } } }
                        },
                    },
                },
            },
        })

        const lastMessages = await Promise.all(
            conversations.map(async (c) => {
                let lastMessage = JSON.parse(await this.redisService.get(`lastMessage:${c.conversationId}`))

                if (!lastMessage && c.conversation.lastMessageId) {
                    const message = await this.messageModel.findById(c.conversation.lastMessageId).lean()

                    if (message) {
                        await this.redisService.set(`lastMessage:${c.conversationId}`, JSON.stringify(
                            {
                                content: message.content,
                                senderId: message.senderId,
                                createdAt: message.createdAt
                            }
                        ))

                        lastMessage = {
                            content: message.content,
                            createdAt: message.createdAt
                        }
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
                name: c.conversation.participants[0]?.user.name || 'Desconhecido'
            }
        })
    }

    async createConversation(userId: string, otherParticipantId: string) {
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
            include: {
                conversation: true,
            },
        });

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
            include: {
                participants: {
                    include: { user: true }
                },
            },
        })

        return newConversation
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
