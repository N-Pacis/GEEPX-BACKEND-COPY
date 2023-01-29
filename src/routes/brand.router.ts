import { Router } from "express";
import {
  activateBrand,
  addBrandLogo,
  deactivateBrand,
  getBrandById,
  getBrands,
  getCategoriesByBrand,
  getProductsByBrandAndCategory,
  getProductsByBrand,
  saveBrand,
  updateBrand,
  getSomeBrands,
  addBrandCoverPhoto,
} from "../controllers/brand.controller";
const brandRouter = Router();
import { uploadHandler } from "../util/fileUpload.util";
import authenticate from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
const upload = uploadHandler();

brandRouter.get("/all", getBrands);
brandRouter.get("/some", getSomeBrands);
brandRouter.get("/get-brand-products", getProductsByBrand);
brandRouter.get("/by-id/:id", admin, getBrandById);
brandRouter.get("/get-brand-categories", getCategoriesByBrand);
brandRouter.get("/get-brand-category-products", getProductsByBrandAndCategory);
brandRouter.post("/save", admin, saveBrand);
brandRouter.put("/update/:id", admin, updateBrand);
brandRouter.put("/activate/:id", admin, activateBrand);
brandRouter.put("/deactivate/:id", admin, deactivateBrand);
brandRouter.put("/:id/add-logo", admin, upload.single("logo"), addBrandLogo);
brandRouter.put(
  "/:id/add-cover-photo",
  admin,
  upload.single("cover-photo"),
  addBrandCoverPhoto
);

export default brandRouter;
