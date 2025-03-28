import { Request, Response } from "express";

export async function adminMiddleware(req: Request, res: Response, next: Function) {
    const {user} = res.locals;

    if (user.role !== "admin") {
        return res.status(401).send({message: "Unauthorized"});
    }
    return next();
}