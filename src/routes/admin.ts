import { Router } from "express";

import { AdminController } from "../controllers/admin.controller";
import { Auth } from "../middleware/auth";

const router = Router();
const adminController = new AdminController();
const { auth } = new Auth();

router.post("/admin/signup", adminController.signup);

router.post("/admin/login", adminController.login);

router.post("/admin/logout", auth, adminController.logout);

router.post("/admin/logoutAll", auth, adminController.logoutFromAllDevices);

router.get("/admin/profile", auth, adminController.getAdmin);

router.patch("/admin/updateInfo", auth, adminController.updateAdmin);

router.patch(
  "/admin/updatePassword",
  auth,
  adminController.updateAdminPassword
);

router.patch("/admin/delete", auth, adminController.deleteAdmin);

export default router;
