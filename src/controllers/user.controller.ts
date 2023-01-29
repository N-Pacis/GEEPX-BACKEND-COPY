import { IOAuthRequest } from "./../types/data";
import { errorResponse } from "./../util/api.response";
import User from "../models/user.model";
import lodash from "lodash";
const { pick } = lodash;
import { genSalt, hash } from "bcrypt";
import bcrypt from "bcrypt";
const { compare } = bcrypt;
import { Request, Response } from "express";
import { IUser } from "../types/user";
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";

export const getUserInformation = async (req: any, res: Response) => {
  try {
    let user: IUser | null = await User.findById(req.user._id).select(
      "-password"
    );
    if (!user) return notFoundResponse("id", req.params.id, "User", res);
    return successResponse("User information", user, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const createStandardUser = async (req: Request, res: Response) => {
  try {
    let user: IUser = new User(
      pick(req.body, [
        "firstname",
        "lastname",
        "address",
        "email",
        "password",
        "phoneNumber",
      ])
    );

    const salt: string = await genSalt(10);
    user.password = await hash(user.password, salt);
    user.registrationType = "STANDARD";
    user.role = "CLIENT";

    await user.save();

    return successResponse("Registered Successfully", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const createAdminStandardAccount = async (
  req: Request,
  res: Response
) => {
  try {
    let user: IUser = new User(
      pick(req.body, [
        "firstname",
        "lastname",
        "address",
        "email",
        "password",
        "phoneNumber",
      ])
    );

    const salt: string = await genSalt(10);
    user.password = await hash(user.password, salt);
    user.registrationType = "STANDARD";
    user.role = "ADMIN";
    await user.save();
    const token: string = user.generateAuthToken();
    let responseObj = {
      token: token,
    };
    return successResponse("Registered Successfully", responseObj, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const OAuthStandardUser = async (req: Request, res: Response) => {
  try {
    let findUser: IUser | null = await User.findOne({ email: req.body.email });
    if (!findUser) {
      let user: IUser = new User(
        pick(req.body, [
          "firstname",
          "lastname",
          "address",
          "email",
          "phoneNumber",
        ])
      );

      const salt: string = await genSalt(10);
      user.password = await hash(user.email, salt);
      user.registrationType = "OAUTH";
      user.role = "CLIENT";
      await user.save();
      const token: string = user.generateAuthToken();
      let responseObj = {
        token: token,
      };
      return successResponse("Login Successfully", responseObj, res);
    } else {
      if (findUser.registrationType != "OAUTH")
        return errorResponse("You did not use this way of signing In", res);

      const token: string = findUser.generateAuthToken();
      let responseObj = {
        token: token,
      };
      return successResponse("Login Successfully", responseObj, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let user: IUser | null = await User.findOne({ email: req.body.email });
    if (!user) return errorResponse("Invalid Email or Password!", res);

    if (user.registrationType != "STANDARD")
      return errorResponse("You did not use this way of signing In", res);

    const validPassword: boolean = await compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return errorResponse("Invalid Email or Password!", res);

    const token: string = user.generateAuthToken();
    let responseObj = {
      token: token,
    };

    return successResponse("Login Successfully", responseObj, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    let user: IUser | null = await User.findById(req.params.id);
    if (!user) return notFoundResponse("id", req.params.id, "User", res);

    await User.findByIdAndUpdate(req.params.id, { status: "ACTIVE" });
    return successResponse("User activated successfully", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    let user: IUser | null = await User.findById(req.params.id);
    if (!user) return notFoundResponse("id", req.params.id, "User", res);

    await User.findByIdAndUpdate(req.params.id, {
      status: "DEACTIVATED",
    });
    return successResponse("User deactivdated successfully", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const viewAllUsers = async (req: Request, res: Response) => {
  try {
    let users: IUser[] = await User.find({}).select("-password");
    return successResponse("Users", users, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
