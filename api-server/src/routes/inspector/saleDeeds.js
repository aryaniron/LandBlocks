import express from "express";
const router = express.Router();
import auth from "../../middleware/auth.js";

import {
  getSaleDeeds,
  makeSaleDeedInspector,
  createSignature,
  verifysignature,
} from "../../controllers/inspector/saleDeeds.js";

router.post("/getSaleDeeds/:tehsil/:district/:state", auth, getSaleDeeds);
router.post("/makeSaleDeedInspector", auth, makeSaleDeedInspector);
router.post("/verifySignature", auth, verifysignature);
router.post("/createSignature", auth, createSignature);

export default router;
