import express from "express";
const router = express.Router({ mergeParams: true });
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";
import catchAsync from "../utils/catchAsync.js";
import { createReview, deleteReview } from "../controllers/review.js";

router.post('/', isLoggedIn, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

export default router;