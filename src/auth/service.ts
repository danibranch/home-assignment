import { Roles } from "@prisma/client";
import prisma from "../prismaClient";
import { Hash, createHash } from "crypto";
import * as jwt from "jsonwebtoken"
import { CustomError } from "../customError";

export async function registerUser(body: {user: {name: string, email: string, password: string}}) {
    const {user} = body;

    if (!user.name || !user.email || !user.password) {
        // 400 - Fields missing
        throw new CustomError(400, "Fields missing");
    }

    // try to search for other user with same email
    const existingUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });

    if (existingUser) {
        // 400 - User already exists
        throw new CustomError(400, "User already exists");
    }

    // hash password
    const hash: Hash = createHash("sha256");
    hash.update(user.password);

    // save user
    const dbUser = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: hash.digest("hex"),
            role: Roles.user
        }
    });

    const tokenPayload = {id: dbUser.id, role: dbUser.role, expiresAt: Date.now() + 1000 * 60 * 60 * 24};
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {expiresIn: "1d"});

    return {
        success: true,
        token
    }
}

export async function loginUser(body: {user: {email: string, password: string}}) {
    const {user} = body;

    if (!user.email || !user.password) {
        // 400 - Fields missing
        throw new CustomError(400, "Fields missing");
    }

    const hash: Hash = createHash("sha256");
    hash.update(user.password);

    const dbUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });

    if (!dbUser || dbUser.password !== hash.digest("hex")) {
        // 401 - Unauthorized
        throw new CustomError(401, "Unauthorized");
    }

    const tokenPayload = {id: dbUser.id, role: dbUser.role, expiresAt: Date.now() + 1000 * 60 * 60 * 24};
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {expiresIn: "1d"});

    return {
        success: true,
        token
    }
}

export async function getUserProfile(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        // 404 - User not found
    }

    return user;
}