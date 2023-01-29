import mongoose from "mongoose"
import { Document } from "mongoose";

export interface IProduct extends Document{
  name: string
  category: mongoose.Types.ObjectId
  brand: mongoose.Types.ObjectId
  price: number
  quantity: number
  sku: string 
  weight: number
  description: string
  store: string
  variant: {
    color: string
    size: {
      height: number
      width: number
    }
  }
  expireDate: Date
  coverPhoto: string
  batchNumber: number
  origin: string
}
