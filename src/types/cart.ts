import mongoose, { Document } from "mongoose";

export interface ICart extends Document{
    addedBy: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    quantity: number
    price:number
    checkedOut:boolean
}