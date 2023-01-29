import mongoose, { model, Schema } from "mongoose";
import { ICart } from "../types/cart";

const cartSchema: Schema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    checkedOut: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Cart = model<ICart>("Cart", cartSchema);
export default Cart;
