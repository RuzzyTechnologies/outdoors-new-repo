import { Router } from "express";

import { Auth } from "../middleware/auth";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();
const { auth } = new Auth();

router.post("/quote/:orderId", auth, orderController.createQuote);

router.patch("/quote/:quoteId", auth, orderController.updateQuote);

router.get("/quote/:quoteId", auth, orderController.findSpecificQuote);

export default router;
