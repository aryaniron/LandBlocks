import express from "express";
const router = express.Router();

import { signUp, signIn, getUser } from "../../controllers/citizen/users.js";

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/getUser/:aadhaar", getUser);
export default router;
