import mongoose, { model, Schema } from "mongoose";
import { ICategory } from "../types/category";

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Deactivated"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default model<ICategory>("Category", categorySchema);
