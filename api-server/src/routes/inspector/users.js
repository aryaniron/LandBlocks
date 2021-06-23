import express from "express";
const router = express.Router();

import {
  signUp,
  signIn,
  getInspector,
  adminSignin,
} from "../../controllers/inspector/users.js";
import auth from "../../middleware/auth.js";

router.post("/adminSignin", adminSignin);
router.post("/signup", auth, signUp);
router.post("/signin", signIn);
router.post("/getInspector/:aadhaar", getInspector);
export default router;
