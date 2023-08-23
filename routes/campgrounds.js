import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { isLoggedIn, isAuthor, validateCampground } from "../middleware.js";
import { index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground } from "../controllers/campgrounds.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground));

router.get("/new", isLoggedIn, renderNewForm);

router.route("/:id")
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

export default router;