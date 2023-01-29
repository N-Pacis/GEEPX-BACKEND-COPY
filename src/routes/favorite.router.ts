import { Router } from "express";

import authenticate from "../middlewares/auth.middleware";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorite.controller";
const favoriteRouter = Router();

favoriteRouter.get("/all",authenticate,getFavorites)
favoriteRouter.post("/add",authenticate, addToFavorites);
favoriteRouter.delete("/remove/:id",authenticate, removeFromFavorites);

export default favoriteRouter;