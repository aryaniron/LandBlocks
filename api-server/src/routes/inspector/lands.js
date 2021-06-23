import express from "express";
const router = express.Router();
import auth from "../../middleware/auth.js";

import {
  getLands,
  addLand,
  getLandHistory,
  transferLand,
  getLand,
} from "../../controllers/inspector/lands.js";

router.post("/getLands/:tehsil/:district/:state", auth, getLands);
router.post("/getLandHistory/:khasraNumber", auth, getLandHistory);
router.post("/addLand", auth, addLand);
router.post("/transferLand", auth, transferLand);
router.post("/getLand/:khasraNumber", auth, getLand);
// router.post("/signup", signup);

export default router;
