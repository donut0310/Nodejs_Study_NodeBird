// Package Modules
import express from "express";

// Custom Modules
import { isLoggedIn } from "./middlewares.js";
import { addFollowing } from "../controllers/user.js";

export const router = express.Router();

router.post("/:id/follow", isLoggedIn, addFollowing);
