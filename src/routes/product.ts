import { Router } from "express";

import { Auth } from "../middleware/auth";
import { ProductController } from "../controllers/product.controller";
import { uploadMiddleware } from "../middleware/multer";

const router = Router();
const productController = new ProductController();
const { auth } = new Auth();
const { multerConfig } = uploadMiddleware();

const image = multerConfig.single("image");

router.post("/products/", auth, productController.addProduct);

router.post(
  "/products/:productId/image",
  auth,
  image,
  productController.uploadImage
);

router.patch(
  "/products/update/:productId",
  auth,
  productController.updateProduct
);

router.get("/products/:productId", auth, productController.getSpecificProduct);

router.get("/products", auth, productController.getAllProducts);

router.get(
  "/products/fetch/by-area",
  auth,
  productController.getProductsByArea
);

router.get(
  "/products/fetch/by-state",
  auth,
  productController.getProductsByState
);

router.delete(
  "/products/delete/:productId",
  auth,
  productController.deleteProduct
);

export default router;
