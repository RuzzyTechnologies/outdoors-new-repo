import { Router } from "express";

import { Auth } from "../middleware/auth";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();
const { auth } = new Auth("user");

router.post("/order/create/:productId", auth, orderController.createOrder);

router.get("/order/:orderId", auth, orderController.findSpecificOrder);

router.get("/orders", auth, orderController.getAllOrders);

export default router;
