import { Router } from "express";

import { AdminController } from "../controllers/admin.controller";
import { Auth } from "../middleware/auth";

const router = Router();
const adminController = new AdminController();
const { auth } = new Auth();

router.post("/signup", adminController.signup);

router.post("/login", adminController.login);

router.post("/logout", auth, adminController.logout);

router.post("/logoutAll", auth, adminController.logoutFromAllDevices);

router.get("/profile", auth, adminController.getAdmin);

router.patch("/updateInfo", auth, adminController.updateAdmin);

router.patch("/updatePassword", auth, adminController.updateAdminPassword);

router.patch("/deleteAdmin", auth, adminController.deleteAdmin);

export default router;
