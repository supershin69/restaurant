import { Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.schema.js';
import { findUserByEmail } from '../utils/findUser.js';
import { prisma } from '../lib/prisma.js';
import bcrypt from "bcryptjs";
import { email } from 'zod';

@Injectable()
export class AuthService {
    async login(data: LoginDTO) {}

    async register(data: RegisterDTO) {
        const existingUser = await findUserByEmail(data.email);
        if (existingUser) throw new Error("Email already exists.");

        const branchId = data.branchId;
        if (branchId !== null) {
            const branch = await prisma.branch.findFirst({
                where: { id: branchId },
                select: { id: true }
            });
            if (!branch) throw new Error("The branch doesn't exist.");
        }

        const isSamePassword = data.password === data.confirmPassword;

        if (!isSamePassword) throw new Error("Confirm password should be the same as password");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
                branchId: branchId ? branchId : null,
                profile: {
                    create: {
                        name: data.name
                    }
                }
                
            },
            include: {
                profile: true,
                branch: true,
            }
        });

        return { user: {
            name: user.profile?.name,
            email: user.email,
            password: user.password,
            role: user.role,
            branch: user.branch ? user.branch : null
        }}
    }
}
