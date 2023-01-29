import { model, Schema } from "mongoose";
import { IUser } from "../types/user";

import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

const userSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    registrationType: {
      type: String,
      enum: ["STANDARD", "OAUTH"],
      default: "STANDARD",
    },
    role: {
      type: String,
      enum: ["ADMIN", "CLIENT"],
      default: "ADMIN",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DEACTIVATED"],
      default: "ACTIVE",
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function (): string {
  let key: string = process.env.JWT_KEY ? process.env.JWT_KEY.trim() : "";

  const token: string = sign({ _id: this._id, role: this.role }, key);
  return token;
};

const User = model<IUser>("User", userSchema);
export default User;
