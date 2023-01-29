import { IProduct } from "../types/product";
import mongoose, { model, Schema } from "mongoose";

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    weight: {
      type: Number,
    },
    description: {
      type: String,
    },
    store: {
      type: String,
    },
    variant: {
      color: {
        type: String,
      },
      size: {
        height: {
          type: Number,
        },
        width: {
          type: Number,
        },
      },
    },
    expireDate: {
      type: Date,
    },
    coverPhoto: {
      type: String,
    },
    batchNumber: {
      type: Number,
    },
    origin: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Deactivated"],
      default: "Deactivated",
    },
  },
  { timestamps: true }
);
const Product = model<IProduct>("Product", productSchema);
export default Product;
