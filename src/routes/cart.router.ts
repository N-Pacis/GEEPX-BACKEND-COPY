import { Router } from "express";
import {
  addToCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cart.controller";
import authenticate from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
const cartRouter = Router();

cartRouter.get("/all",authenticate,getCart)
cartRouter.post("/add",authenticate, addToCart);
cartRouter.put("/update/:id",authenticate, updateCart);
cartRouter.delete("/delete/:id",authenticate, deleteCart);

export default cartRouter;