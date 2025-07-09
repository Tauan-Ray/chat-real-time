import { PrismaService } from '@infra/database/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { ConversationService } from '../conversation/conversation.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MessageService {
    constructor(
        private prisma: PrismaService,
        private conversationService: ConversationService,
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>
    ) {}

    async getMessages(userId: string, conversationId: string, page = 1, pageLimit = 25) {
        const participation = await this.prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId,
                deletedAt: null
            },
        });

        if (!participation) {
            throw new UnauthorizedException('Você não participa dessa conversa')
        }

        const skip = (page - 1) * pageLimit

        const messages = await this.messageModel.find({
            conversationId
        })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(pageLimit)
        .exec()

        return {
            messages,
            page,
            pageLimit
        }
    }

    async getUnreadMessages(userId: string, conversationId: string) {
        const unreadCount = await this.messageModel.countDocuments({
            conversationId,
            senderId: { $ne: userId },
            readBy: { $ne: userId }
        })

        return { unreadCount }
    }

    async createMessage(userId: string, conversationId: string, content: string) {
        const participation = await this.prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId,
                deletedAt: null
            },
        });

        if (!participation) {
            throw new UnauthorizedException('Você não participa dessa conversa')
        }

        const createdMessage = await this.messageModel.create({
            conversationId,
            senderId: userId,
            content
        })

        const fullMessage = await this.messageModel.findById(createdMessage._id).exec()

        await this.conversationService.updateConversation(
            userId,
            conversationId,
            fullMessage._id.toString(),
            fullMessage.createdAt
        )

        return fullMessage
    }

    async deleteMessage(userId: string, messageId: string) {
        const message = await this.messageModel.findById(messageId)

        if (!message) {
            throw new NotFoundException('Mensagem não encontrada')
        }

        if (message.senderId !== userId) {
            throw new UnauthorizedException('Você não tem permissão para excluir essa mensagem')
        }

        message.deletedAt = new Date()
        await message.save()

        return { message: 'Mensagem deletada com sucesso' }
    }

    async markRead(userId: string, messageId: string) {
        const message = await this.messageModel.findById(messageId)

        if (!message || message.deletedAt) {
            throw new NotFoundException('Mensagem não encontrada')
        }

        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId)
            await message.save()
        }

        return { message: 'Mensagem marcada como lida' }
    }


}
