import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

export interface ITrackingOrderData{
  success: boolean
  data?: {
    order_number:string
    order_awb_number:string
  }
}

export interface IOAuthRequest{
  email:string
  firstname:string
  lastname:string
  phoneNumber?:string
}