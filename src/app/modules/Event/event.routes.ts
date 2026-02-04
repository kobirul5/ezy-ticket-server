import express from "express";
import { EventControllers } from "./event.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", EventControllers.getAllEvents);
router.get("/:id", EventControllers.getSingleEvent);
router.get("/my-added-events/:email", auth(), EventControllers.getMyAddedEvents);

router.post("/", auth("ADMIN", "EVENT_MANAGER"), EventControllers.createEvent);
router.patch("/:id", auth("ADMIN", "EVENT_MANAGER"), EventControllers.updateEvent);
router.delete("/:id", auth("ADMIN", "EVENT_MANAGER"), EventControllers.deleteEvent);

export const EventRoutes = router;
