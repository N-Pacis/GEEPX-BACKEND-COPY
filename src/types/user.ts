import { Document } from "mongoose";

export interface IUser extends Document{
  firstname: string
  lastname: string
  email: string
  phoneNumber:string
  password: string
  registrationType: string
  address:string
  role:string
  status:string
  generateAuthToken: Function
}