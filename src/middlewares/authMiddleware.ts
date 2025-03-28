import jwt from "jsonwebtoken";
import prisma from "../prismaClient"
import { Request, Response } from "express";

export async function authMiddleware(req: Request, res: Response, next: Function) {
    const fullToken = req.headers.authorization;

    if (!fullToken) {
        return res.status(401).send({message: "Unauthorized"});
    }

    // verify token
    try {
        const token = fullToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id: string, role: string, exp: number};

        if (decoded.exp >= Date.now()) {
            console.log("aaaaa")
            return res.status(401).send({message: "Unauthorized"});
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            return res.status(401).send({message: "Unauthorized"});
        }
        
        res.locals.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).send({message: "Unauthorized"});
    }
}