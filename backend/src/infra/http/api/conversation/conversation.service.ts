import { PrismaService } from '@infra/database/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class ConversationService {
    constructor(private prisma: PrismaService) {}

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
                            include: { user: true },
                        },
                    },
                },
            },
        })

        return conversations.map(conversation => ({
            conversationId: conversation.conversationId,
            lastMessageId: conversation.conversation.lastMessageId,
            lastMessageDate: conversation.conversation.lastMessageDate,
            participant: conversation.conversation.participants[0]?.user,

        }))
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
