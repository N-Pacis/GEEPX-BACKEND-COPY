import { Router } from "express";
import {
  activateCategory,
  deactivateCategory,
  getCategories,
  getCategoryById,
  saveCategory,
  updateCategory,
} from "../controllers/category.controller";
import authenticate from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
const categoryRouter = Router();

categoryRouter.get("/all", admin,getCategories);
categoryRouter.get("/by-id/:id", admin,getCategoryById);
categoryRouter.post("/save", admin,saveCategory);
categoryRouter.put("/update/:id", admin,updateCategory);
categoryRouter.put("/activate/:id", admin,activateCategory);
categoryRouter.put("/deactivate/:id", admin,deactivateCategory);

export default categoryRouter;
