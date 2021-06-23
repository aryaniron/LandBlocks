import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModal from "../../models/user.js";

const secret = "test";

import { registerUser, userLoginAndEnroll } from "../../Utils/registerUser.js";

export const signUp = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      aadhaar,
      mobile,
      address,
      pincode,
      villageOrCity,
      district,
      stateOrUt,
      image,
    } = req.body;

    let response = await registerUser({ OrgMSP: "Org1MSP", userId: aadhaar });

    const oldUser = await UserModal.findOne({ aadhaar });

    if (oldUser) throw "User with Aaadhaar Number already exists";

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModal.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      aadhaar,
      mobile,
      address,
      pincode,
      villageOrCity,
      district,
      stateOrUt,
      image,
    });

    const token = jwt.sign({ userId: aadhaar, orgMSP: "Org1MSP" }, secret, {
      expiresIn: "24h",
    });

    if (response && typeof response !== "string")
      res.json({ token: token, user: user, role: "citizen" });
    else throw response;
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { aadhaar, password } = req.body;

    const oldUser = await UserModal.findOne({ aadhaar: aadhaar });

    if (!oldUser) throw "Aadhaar Number is not Registered";

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) throw "Password and Aadhaar Number dont match";

    let response = await userLoginAndEnroll({
      OrgMSP: "Org1MSP",
      userId: aadhaar,
    });

    const token = jwt.sign({ userId: aadhaar, orgMSP: "Org1MSP" }, secret, {
      expiresIn: "24h",
    });

    if (response && response === true)
      res.json({ token: token, user: oldUser, role: "citizen" });
    else throw "User Does not Exist in Wallet!";
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const aadhaar = req.params.aadhaar;

    const oldUser = await UserModal.findOne({ aadhaar: aadhaar });

    if (!oldUser) throw "User does not exist in MongoDB";

    res.json(oldUser);
  } catch (error) {
    res.send(error);
  }
};

export default router;
