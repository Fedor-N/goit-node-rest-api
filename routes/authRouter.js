import express from "express";
import { upload } from "../middlewares/upload.js"; // імпорт мідлвару

import {
  register,
  login,
  logout,
  current,
  updateAvatar,
} from "../controllers/authControllers.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.get("/current", isAuthenticated, current);

// Завантаження аватара
authRouter.patch("/avatars", isAuthenticated, upload.single("avatar"), updateAvatar);

export default authRouter;
