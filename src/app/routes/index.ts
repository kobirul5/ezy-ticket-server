import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { userRoutes } from "../modules/User/user.route";
import { EventRoutes } from "../modules/Event/event.routes";
import { EntertainmentRoutes } from "../modules/Entertainment/entertainment.routes";
import { TravelRoutes } from "../modules/Travel/travel.routes";
import { OrderRoutes } from "../modules/Order/order.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/events",
    route: EventRoutes,
  },
  {
    path: "/entertainment",
    route: EntertainmentRoutes,
  },
  {
    path: "/travel",
    route: TravelRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
