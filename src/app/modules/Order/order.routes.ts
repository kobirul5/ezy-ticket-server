import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth("ADMIN"), OrderControllers.getAllOrders);
router.post("/create-payment", auth(), OrderControllers.createOrder);
router.get("/:tranId", OrderControllers.getOrder);

router.post("/payment/success/:tranId", OrderControllers.paymentSuccess);
router.post("/payment/fail/:tranId", OrderControllers.paymentFail);

export const OrderRoutes = router;
