import express, { NextFunction, Request, Response } from "express";
import { EventControllers } from "./event.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.get("/", EventControllers.getAllEvents);
router.get("/my-added-events/:email", auth(), EventControllers.getMyAddedEvents);
router.get("/:id", EventControllers.getSingleEvent);

router.post(
    "/",
    auth("ADMIN", "EVENT_MANAGER"),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return EventControllers.createEvent(req, res, next);
    }
);
router.patch(
    "/:id",
    auth("ADMIN", "EVENT_MANAGER"),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        return EventControllers.updateEvent(req, res, next);
    }
);
router.delete("/:id", auth("ADMIN", "EVENT_MANAGER"), EventControllers.deleteEvent);

export const EventRoutes = router;
