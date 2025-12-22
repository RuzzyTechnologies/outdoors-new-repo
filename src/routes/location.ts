import { Router } from "express";

import { Auth } from "../middleware/auth";
import { LocationController } from "../controllers/location.controller";

const router = Router();
const locationController = new LocationController();
const { auth } = new Auth();

router.post("/locations/state", auth, locationController.createArea);

router.post("/locations/area", auth, locationController.createState);

router.get(
  "/locations/areas",
  auth,
  locationController.getAllAreasInASpecificState
);

router.get("/locations/states/all", auth, locationController.getAllStates);

router.get("/locations/area", auth, locationController.getArea);

router.get("/locations/state", auth, locationController.getState);

export default router;
