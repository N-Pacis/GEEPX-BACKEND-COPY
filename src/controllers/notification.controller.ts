import { responseEncoding } from "axios";
import { Response, Request } from "express";
import Notification from "../models/notifications.model";
export const createNotification = async (req: Request, res: Response) => {};

export const getSomeNotifications = async (req: Request, res: Response) => {};

export const clearAllNotification = async (req: Request, res: Response) => {
    await Notification.findOneAndUpdate({}, {status: "Dea"})
};

export const clearNotification = async (req: Request, res: Response) => {
    
};

export const markNotificationsAsRead = async (
  req: Request,
  res: Response
) => {

};
