import { PrismaService } from '@infra/database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { hash } from 'bcrypt'
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findUnique(value: string): Promise<User> {
        const isEmail = value.includes('@')
        const user = await this.prisma.user.findUnique({
            where: isEmail ? { email: value } : { id: value },
        })

        if (!user) {
            throw new HttpException(
                'Usuário não encontrado',
                HttpStatus.NOT_FOUND,
            )
        }

        return user
    }

    async createUser(data: CreateUserDto): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            throw new HttpException(
                'Email já registrado no sistema',
                HttpStatus.BAD_REQUEST,
            )
        }

        const hashedPassword  = await hash(data.password, 10)

        return await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: hashedPassword
            }
        })


    }
}
