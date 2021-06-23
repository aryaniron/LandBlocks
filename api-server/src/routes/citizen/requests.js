import express from "express";
const router = express.Router();
import auth from "../../middleware/auth.js";

import {
  getRequestsForMyLand,
  createInfoRequest,
  createBuyRequest,
  getInfoRequest,
  getBuyRequest,
  approveRequest,
  rejectRequest,
} from "../../controllers/citizen/requests.js";
// const { signin, signup } = require("../controllers/requests.js");

// router.post("/signin", signin);
// router.post("/signup", signup);

router.get("/getRequestsForMyLand/:khasraNumber", auth, getRequestsForMyLand);
router.post("/createInfoRequest/:khasraNumber", auth, createInfoRequest);
router.post("/createBuyRequest/:khasraNumber", auth, createBuyRequest);
router.get("/getInfoRequest/:khasraNumber", auth, getInfoRequest);
router.get("/getBuyRequest/:khasraNumber", auth, getBuyRequest);
router.patch("/approve/:requestId", auth, approveRequest);
router.patch("/reject/:requestId", auth, rejectRequest);

export default router;
