import express from "express";
import { EntertainmentControllers } from "./entertainment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/halls", EntertainmentControllers.getAllCinemaHalls);
router.post("/halls", auth("ADMIN", "ENTERTAINMENT_MANAGER"), EntertainmentControllers.createCinemaHall);

router.get("/movies", EntertainmentControllers.getAllMovies);
router.get("/movies/:id", EntertainmentControllers.getSingleMovie);
router.post("/movies", auth("ADMIN", "ENTERTAINMENT_MANAGER"), EntertainmentControllers.createMovie);
router.patch("/movies/:id", auth("ADMIN", "ENTERTAINMENT_MANAGER"), EntertainmentControllers.updateMovie);
router.delete("/movies/:id", auth("ADMIN", "ENTERTAINMENT_MANAGER"), EntertainmentControllers.deleteMovie);

export const EntertainmentRoutes = router;
