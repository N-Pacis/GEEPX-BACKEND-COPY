import { IFavorite } from './../types/favorite';
import mongoose, { model, Schema } from "mongoose";

const favoriteSchema: Schema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Favorite = model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;
