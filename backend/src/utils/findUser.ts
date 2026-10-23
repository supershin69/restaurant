import { prisma } from "../lib/prisma.js";

export async function findUserByEmail(email: string) {
    const existingUser = await prisma.user.findUnique(
        {
            where: { email: email }
        }
    );

    return existingUser;
}