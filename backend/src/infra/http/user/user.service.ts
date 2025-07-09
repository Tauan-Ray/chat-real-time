import { PrismaService } from '@infra/database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { hash } from 'bcrypt'
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findUnique(value: string): Promise<User> {
        const isEmail = value.includes('@')
        return await this.prisma.user.findUnique({
            where: isEmail ? { email: value } : { id: value },
        })
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
