import express from "express";
import {  Register } from "../Controllers/userController.js";
import { Login } from "../Controllers/userController.js";
import { Logout } from "../Controllers/userController.js";
import isAuthenticated from "../config/auth.js";
import { bookmarks } from "../Controllers/userController.js";
import { getMyProfile } from "../Controllers/userController.js";
import { getOtherUsers } from "../Controllers/userController.js";
import { follow } from "../Controllers/userController.js";
import { unfollow } from "../Controllers/userController.js";

const router = express.Router();

router.route("/register").post(Register);

router.route("/login").post(Login);

router.route("/logout").get(Logout);

router.route("/bookmark/:id").put(isAuthenticated , bookmarks);

router.route("/profile/:id").get(isAuthenticated , getMyProfile);

router.route("/otherusers/:id").get(isAuthenticated , getOtherUsers);

router.route("/follow/:id").post(isAuthenticated , follow);

router.route("/unfollow/:id").post(isAuthenticated , unfollow);


export default router;