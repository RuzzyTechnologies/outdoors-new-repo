import { Router } from "express";

import { Auth } from "../middleware/auth";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const productController = new ProductController();
const { auth } = new Auth();

router.post("/products/", auth, productController.addProduct);

router.post("/products/:productId/image", auth, productController.uploadImage);

router.patch(
  "/products/update/:productId",
  auth,
  productController.updateProduct
);

router.get("/products/:productId", auth, productController.getSpecificProduct);

router.get("/products", auth, productController.getAllProducts);

router.get("/products/by-area", auth, productController.getProductsByArea);

router.get("/products/by-state", auth, productController.getProductsByState);

router.delete(
  "/products/delete/:productId",
  auth,
  productController.deleteProduct
);

export default router;
