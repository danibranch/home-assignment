import { Request, Response } from "express";
import { CustomError } from "../customError";

export async function errorMiddleware(err: any, req: Request, res: Response, next: Function) {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  console.log(err);
  console.log(JSON.stringify(err));
  console.log(typeof err);
  console.log(err instanceof CustomError);
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ message: err.message });
  }
  else res.status(500).send({ message: "Internal Server Error" });
}