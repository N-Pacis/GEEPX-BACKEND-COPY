import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document{
    addedBy: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
}