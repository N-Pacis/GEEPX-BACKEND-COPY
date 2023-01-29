import mongoose from "mongoose";
import { NextFunction, Response } from "express";
import { errorResponse } from "../util/api.response";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/data";
import { Request } from "express";

declare module "jsonwebtoken" {
  export interface UserJwtPayload extends jwt.JwtPayload {
    _id: mongoose.ObjectId;
    role: string;
  }
}

const { verify } = jwt;

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.header("Authorization"))
    return errorResponse("Access Denied! You need to login first", res);

  const token: string | undefined = req.header("Authorization")
    ?.trim()
    ?.replace("Bearer ", "");

  if (!token)
    return errorResponse("Access Denied! You need to login first", res);
  try {
    let key: string = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";

    const decoded = <jwt.UserJwtPayload>verify(token, key);
    (req as unknown as CustomRequest).user = decoded;
    if (decoded.role != "ADMIN")
      return errorResponse(
        "Access Denied! You must be an admin to use this route!",
        res
      );
    next();
  } catch (ex) {
    return errorResponse("Invalid token", res);
  }
}
