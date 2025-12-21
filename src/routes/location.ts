import { Router } from "express";

import { Auth } from "../middleware/auth";
import { LocationController } from "../controllers/location.controller";

const router = Router();
const locationController = new LocationController();
const { auth } = new Auth();

router.post("/location/state/create", auth, locationController.createArea);

router.post("/location/area/create", auth, locationController.createState);

router.get(
  "/location/areasInAState",
  auth,
  locationController.getAllAreasInASpecificState
);

router.get("/location/state/all", auth, locationController.getAllStates);

router.get("/location/area", auth, locationController.getArea);

router.get("/location/state", auth, locationController.getState);

export default router;
