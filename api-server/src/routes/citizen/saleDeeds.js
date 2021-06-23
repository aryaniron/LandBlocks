import express from "express";
const router = express.Router();
import auth from "../../middleware/auth.js";

import {
  getSaleDeed,
  makeSaleDeedBuyer,
  makeSaleDeedSeller,
  queryRequestedSaleDeeds,
  createSignature,
  verifysignature,
  queryCompletedSaleDeeds,
  rejectSaleDeed,
} from "../../controllers/citizen/saleDeeds.js";

router.post("/getSaleDeed/:saleDeedId", auth, getSaleDeed);
router.post("/makeSaleDeedBuyer", auth, makeSaleDeedBuyer);
router.post("/makeSaleDeedSeller", auth, makeSaleDeedSeller);
router.post(
  "/queryRequestedSaleDeeds/:khasraNumber",
  auth,
  queryRequestedSaleDeeds
);
router.post(
  "/queryCompletedSaleDeeds/:khasraNumber",
  auth,
  queryCompletedSaleDeeds
);
router.post("/verifySignature", auth, verifysignature);
router.post("/createSignature", auth, createSignature);

router.post("/rejectSaleDeed/:saleDeedId", auth, rejectSaleDeed);
export default router;
