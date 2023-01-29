import mongoose, { model, Schema } from "mongoose";
import { INotification } from "../types/notification";

const notificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: {
      admin: { type: mongoose.Types.ObjectId, ref: "users" },
      users: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    },
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Deactive"]
  }
});

const Notification = model<INotification>("Notification", notificationSchema);
export default Notification;
