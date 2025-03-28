import { createHash, Hash } from "crypto";
import { CustomError } from "../customError";
import prisma from "../prismaClient";

export async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        throw new CustomError(404, "User not found");
    }

    return user;
}

export async function updateUser(id: string, user: {name?: string, email?: string, password?: string}) {
    let updateData: {name?: string, email?: string, password?: string} = {};

    if (user.email) {
        updateData.email = user.email;
    }
    if (user.name) {
        updateData.name = user.name;
    }
    if (user.password) {
        const hash: Hash = createHash("sha256");
        hash.update(user.password);
        updateData.password = hash.digest("hex");
    }

    const response = await prisma.user.update({
        where: {
            id: id
        },
        data: updateData
    });
    return response;
}

export async function deleteUser(id: string) {
    const response = await prisma.user.delete({
        where: {
            id: id
        }
    });
    return response;
}