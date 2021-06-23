import express from "express";
const router = express.Router();
import { getContract, getIdentity } from "../../Utils/getContract.js";
import SHA256 from "sha256";
import { KJUR, X509 } from "jsrsasign";
import crypto from "crypto";
import InspectorModal from "../../models/inspector.js";
import bcrypt from "bcrypt";

export const getSaleDeeds = async (request, response) => {
  try {
    const userId = request.userId;
    const { tehsil, district, state } = request.params;
    const contract = await getContract("saledeed", userId, "Org2MSP");
    let result = await contract.evaluateTransaction(
      "QuerySaleDeedsByTehsil",
      tehsil,
      district,
      state
    );

    if (result.toString()) response.send(result);
    else response.send("No Sale Deeds");
  } catch (error) {
    response.send(error);
  }
};

export const makeSaleDeedInspector = async (request, response) => {
  try {
    const userId = request.userId;
    const { id, drafterSignature, time } = request.body;

    const contract = await getContract("saledeed", userId, "Org2MSP");

    let result = await contract.submitTransaction(
      "MakeSaleDeedInspector",
      id,
      userId,
      drafterSignature,
      time
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export const verifysignature = async (request, response) => {
  try {
    const userId = request.userId;
    const { user, saleDeedId, khasraNumber } = request.body;

    const file = (saleDeedId + khasraNumber + user).toString();
    var hashToAction = SHA256(file);
    const identity = await getIdentity({ userId: user, org: "Org2MSP" });

    if (identity && identity.type === "X.509") {
      const contract = await getContract("saledeed", userId, "Org2MSP");
      let result = await contract.evaluateTransaction(
        "QuerySaleDeedById",
        saleDeedId
      );

      var resultJSON = JSON.parse(result);
      const signature = resultJSON.drafterSignature;

      const certLoaded = identity.credentials.certificate;
      const userPublicKey = crypto
        .createPublicKey(certLoaded)
        .export({ type: "spki", format: "pem" });

      // Show info about certificate provided
      const certObj = new X509();
      certObj.readCertPEM(certLoaded);

      var recover = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
      recover.init(userPublicKey);
      recover.updateHex(hashToAction);

      var getBackSigValueHex = new Buffer(signature, "base64").toString("hex");
      const verified = recover.verify(getBackSigValueHex);
      response.send(verified);
    } else response.send("Not a valid X509 identity");
  } catch (error) {
    response.send(error);
  }
};

export const createSignature = async (request, response) => {
  try {
    const userId = request.userId;
    const { password, saleDeedId, khasraNumber } = request.body;

    const oldUser = await InspectorModal.findOne({ aadhaar: userId });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) response.send(false);
    else {
      const file = (saleDeedId + khasraNumber + userId).toString();

      var hashToAction = SHA256(file);
      const identity = await getIdentity({ userId: userId, org: "Org2MSP" });

      if (identity && identity.type === "X.509") {
        const userPrivateKey = identity.credentials.privateKey;
        console.log("Private key : " + userPrivateKey);
        var sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
        sig.init(userPrivateKey, "");
        sig.updateHex(hashToAction);
        var sigValueHex = sig.sign();
        var sigValueBase64 = new Buffer(sigValueHex, "hex").toString("base64");
        console.log("Signature: " + sigValueBase64);
        response.send(sigValueBase64);
      } else response.send("Not a valid X509 identity");
    }
  } catch (error) {
    response.send(error);
  }
};

export default router;
