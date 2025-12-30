import { Router } from "express";

import { Auth } from "../middleware/auth";
import { UserController } from "../controllers/user.controller";
import { uploadMiddleware } from "../middleware/multer";

const { multerConfig } = uploadMiddleware();

const upload = multerConfig.single("avatar");

const router = Router();
const userController = new UserController();
const { auth } = new Auth("user");

router.post("/users/signup", userController.signup);

router.post("/users/login", userController.login);

router.post("/users/logout", auth, userController.logout);

router.post("/users/logoutAll", auth, userController.logoutFromAllDevices);

router.get("/users/profile", auth, userController.getUser);

router.patch("/users/updateInfo", auth, userController.updateUser);

router.post("/users/avatar", auth, upload, userController.uploadAvatar);

router.patch("/users/updatePassword", auth, userController.updateUserPassword);

router.patch("/users/delete", auth, userController.softDeleteUser);

export default router;
