import express from "express";
import {
  addUser,
  confirmEmail,
  deleteUser,
  editPassword,
  isAuthenticated,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth/authentication.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/confirmemail", confirmEmail);
router.post("/handlekey", editPassword);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/adduser", addUser);
router.post("/delete", deleteUser);


export default router