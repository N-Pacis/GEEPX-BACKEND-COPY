import mongoose, { Document } from "mongoose";

export interface IOrder extends Document{
    createdBy: mongoose.Types.ObjectId
    items: any[]
    shipping: {
        area: string
        city: string
        region:string
        country:string
        zipcode:string
        latitude:string
        longitude:string
    }
    asyad:{
        order_number:string|undefined
        order_awb_number:string|undefined
    }
    otherDetails?: string
    orderRef:string
    totalPrice:number
}