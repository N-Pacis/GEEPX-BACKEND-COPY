import { IOrder } from "../types/order";
import mongoose, { model, Schema } from "mongoose";

const orderSchema: Schema = new Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items:{
      type: Array,
      required: true
    },
    totalPrice: {
      type: String,
      required: true,
    },
    orderRef: {
      type: String,
      required: true,
      unique: true,
    },
    otherDetails: {
      type: String,
    },
    shipping: {
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    asyad: {
      order_number: {
        type: String,
        default: ""
      },
      order_awb_number : {
        type: String,
        default: ""
      }
    }
  },

  { timestamps: true }
);
const Order = model<IOrder>("Order", orderSchema);
export default Order;
