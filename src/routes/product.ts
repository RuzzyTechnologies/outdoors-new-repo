import { Router } from "express";

import { Auth } from "../middleware/auth";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const productController = new ProductController();
const { auth } = new Auth();

router.post("/product/create", auth, productController.addProduct);

router.patch(
  "/product/uploadImage/:productId",
  auth,
  productController.uploadImage
);

router.patch(
  "/product/update/:productId",
  auth,
  productController.updateProduct
);

router.get("/product/:productId", auth, productController.getSpecificProduct);

router.get("/products", auth, productController.getAllProducts);

router.get("/productsByArea", auth, productController.getProductsByArea);

router.get("/productsByState", auth, productController.getProductsByState);

router.delete(
  "/product/delete/:productId",
  auth,
  productController.deleteProduct
);

export default router;
