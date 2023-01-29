import { IBrand } from "./../types/brand";
import mongoose, { model, Schema } from "mongoose";

const brandSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    description: {
      type: String,
    },
    countryOrigin: {
      type: String,
    },
    categories: {
      type: [
        { type: mongoose.Types.ObjectId, required: true, ref: "Category" },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Deactivated"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default model<IBrand>("Brand", brandSchema);
