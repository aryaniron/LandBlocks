import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import InspectorModal from "../../models/inspector.js";

const secret = "test";
import { getContract, getIdentity } from "../../Utils/getContract.js";
import { registerUser, userLoginAndEnroll } from "../../Utils/registerUser.js";

export const signUp = async (req, res) => {
  try {
    if (req.userId !== "admin") throw "Failed Authorisation";

    const {
      password,
      firstName,
      lastName,
      aadhaar,
      tehsil,
      district,
      stateOrUt,
      image,
    } = req.body;

    let response = await registerUser({ OrgMSP: "Org2MSP", userId: aadhaar });

    const oldUser = await InspectorModal.findOne({ aadhaar });

    if (oldUser) throw "Inspector with Aaadhaar Number already exists";

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await InspectorModal.create({
      firstName,
      lastName,
      aadhaar,
      password: hashedPassword,
      tehsil,
      district,
      stateOrUt,
      image,
    });

    if (response && typeof response !== "string") res.json({ user: user });
    else throw response;
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { aadhaar, password } = req.body;

    const oldUser = await InspectorModal.findOne({ aadhaar: aadhaar });

    if (!oldUser) throw "Aadhaar Number is not Registered";

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) throw "Password and Aadhaar Number dont match";

    let response = await userLoginAndEnroll({
      OrgMSP: "Org2MSP",
      userId: aadhaar,
    });

    const token = jwt.sign({ userId: aadhaar, orgMSP: "Org2MSP" }, secret, {
      expiresIn: "24h",
    });

    if (response && response === true)
      res.json({ token: token, user: oldUser, role: "inspector" });
    else throw "User Does not Exist in Wallet!";
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getInspector = async (req, res) => {
  try {
    const aadhaar = req.params.aadhaar;

    const oldUser = await InspectorModal.findOne({ aadhaar: aadhaar });

    if (!oldUser) throw "User does not exist in MongoDB";

    res.json(oldUser);
  } catch (error) {
    res.send(error);
  }
};

export const adminSignin = async (req, res) => {
  try {
    let { adminId, privateKey } = req.body;
    privateKey = privateKey.replace(/\\n/g, "\n");
    privateKey = privateKey.replace(/\\r/g, "\r");
    const identity = await getIdentity({ userId: adminId, org: "Org2MSP" });

    if (identity && identity.type === "X.509") {
      const userPrivateKey = identity.credentials.privateKey;

      if (privateKey === userPrivateKey) {
        const token = jwt.sign({ userId: "admin", orgMSP: "Org2MSP" }, secret, {
          expiresIn: "24h",
        });

        res.json({ token: token, user: adminId, role: "admin" });
      } else {
        throw "Private Key is not valid";
      }
    } else throw "Not a valid X509 identity";
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export default router;
