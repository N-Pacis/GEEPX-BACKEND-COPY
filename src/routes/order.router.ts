import { createOrder,getAllOrders } from './../controllers/order.controller';
import { Router } from "express";
import authenticate from '../middlewares/auth.middleware';
import admin from "../middlewares/admin.middleware"
const orderRouter = Router();

orderRouter.post("/create",authenticate, createOrder);
orderRouter.get("/all",admin, getAllOrders);

export default orderRouter;