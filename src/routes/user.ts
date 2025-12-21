import { Router } from "express";

import { Auth } from "../middleware/auth";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();
const { auth } = new Auth("user");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout", auth, userController.logout);

router.post("/logoutAll", auth, userController.logoutFromAllDevices);

router.get("/profile", auth, userController.getUser);

router.patch("/updateInfo", auth, userController.updateUser);

router.patch("/uploadAvatar", auth, userController.uploadAvatar);

router.patch("/updatePassword", auth, userController.updateUserPassword);

router.patch("/deleteAdmin", auth, userController.softDeleteUser);

export default router;
