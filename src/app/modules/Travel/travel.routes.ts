import express from "express";
import { TravelControllers } from "./travel.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/services", TravelControllers.getAllBusServices);
router.post("/services", auth("ADMIN", "TRAVEL_MANAGER"), TravelControllers.createBusService);

router.get("/tickets", TravelControllers.getAllBusTickets);
router.post("/tickets", auth("ADMIN", "TRAVEL_MANAGER"), TravelControllers.createBusTicket);

export const TravelRoutes = router;
