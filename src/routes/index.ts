import brandRouter from "./brand.router";
import productRouter from "./product.router";
import categoryRouter from "./category.router";
import cartRouter from "./cart.router";
import orderRouter from "./order.router";
import userRouter from "./user.router"
import favoriteRouter from "./favorite.router";
import { Router } from "express";

const api = Router();
api.use("/brands", brandRouter);
api.use("/products", productRouter);
api.use("/categories", categoryRouter);
api.use("/cart", cartRouter);
api.use("/orders", orderRouter);
api.use("/users",userRouter);
api.use("/favorites",favoriteRouter)

export default api;