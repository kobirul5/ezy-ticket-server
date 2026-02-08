import express from "express";
import { TravelControllers } from "./travel.controller";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpars/fileUploadHelper";

const router = express.Router();

router.get("/bus", auth("ADMIN", "TRAVEL_MANAGER", "USER"), TravelControllers.getAllBusServices);
router.get("/bus/:id", auth("ADMIN", "TRAVEL_MANAGER", "USER"), TravelControllers.getBusById);
router.post(
  "/bus-create",
  auth("ADMIN", "TRAVEL_MANAGER"),
  FileUploadHelper.upload.single("file"),
  TravelControllers.createBusService
);
router.put(
  "/bus/:id",
  auth("ADMIN", "TRAVEL_MANAGER"),
  FileUploadHelper.upload.single("file"),
  TravelControllers.updateBusService
);
router.delete(
  "/bus/:id",
  auth("ADMIN", "TRAVEL_MANAGER"),
  TravelControllers.deleteBusService
);

router.get("/bus-ticket", TravelControllers.getAllBusTickets);
router.post("/bus-ticket", auth("ADMIN", "TRAVEL_MANAGER"), TravelControllers.createBusSchedule);
router.get("/stand", TravelControllers.getBusStands);

// 
router.post('/', TravelControllers.createTravelLocation);
router.get('/', TravelControllers.getAllTravelLocations);
export const TravelRoutes = router;
