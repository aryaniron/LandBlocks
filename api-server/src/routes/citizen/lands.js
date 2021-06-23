import express from "express";
const router = express.Router();
import auth from "../../middleware/auth.js";

import {
  getMyLands,
  markMyLandForSale,
  unmarkMyLandForSale,
  getLandsForSale,
  getLandHistory,
} from "../../controllers/citizen/lands.js";

router.post("/getMyLands", auth, getMyLands);
router.post("/markMyLandForSale/:khasraNumber/:price", auth, markMyLandForSale);
router.post("/unmarkMyLandForSale/:khasraNumber", auth, unmarkMyLandForSale);
router.post("/getLandsForSale", auth, getLandsForSale);
router.post("/getLandHistory/:khasraNumber", auth, getLandHistory);

// router.post("/signup", signup);

export default router;
