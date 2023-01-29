import { Router } from "express";
import {
  activateProduct,
  addProduct,
  editProductDetails,
  getAllProducts,
  getProductById,
  deactivateProduct,
  addProductCoverPhoto,
  getSomeProducts,
  searchProducts,
  addDiscountToProduct,
} from "../controllers/product.controller";
import { uploadHandler } from "../util/fileUpload.util";
import authenticate from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
const upload = uploadHandler();

const productRouter = Router();
productRouter.put("/add-product-discount", admin, addDiscountToProduct);
productRouter.post("/add", admin, addProduct);
productRouter.get("/all", getAllProducts);
productRouter.post("/search", searchProducts);
productRouter.get("/some", getSomeProducts);
productRouter.get("/by-id/:id", getProductById);
productRouter.put("/edit/:id", admin, editProductDetails);
productRouter.put("/activate/:id", admin, activateProduct);
productRouter.put("/deactivate/:id", admin, deactivateProduct);
productRouter.put(
  "/:id/add-cover-photo",
  authenticate,
  admin,
  upload.single("cover-photo"),
  addProductCoverPhoto
);

export default productRouter;
