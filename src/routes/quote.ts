import { Router } from "express";

import { Auth } from "../middleware/auth";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();
const { auth } = new Auth();

router.post("/quotes/:orderId", auth, orderController.createQuote);

router.patch("/quotes/:quoteId", auth, orderController.updateQuote);

router.get("/quotes/:quoteId", auth, orderController.findSpecificQuote);

export default router;
