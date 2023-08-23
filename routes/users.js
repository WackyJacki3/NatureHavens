import express from "express";
const router = express.Router();
import passport from "passport";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";
import { storeReturnTo } from "../middleware.js";
import { renderRegister, register, renderLogin, login, logout } from "../controllers/users.js";

router.route("/register")
    .get(renderRegister)
    .post(catchAsync(register));

router.route("/login")
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

router.get("/logout", logout);

export default router;