import express from "express";
const router = express.Router();
import { getContract, getIdentity } from "../../Utils/getContract.js";
import SHA256 from "sha256";
import { KJUR, X509 } from "jsrsasign";
import crypto from "crypto";
import bcrypt from "bcrypt";

import UserModal from "../../models/user.js";
import RequestModal from "../../models/request.js";

export const getSaleDeed = async (request, response) => {
  try {
    const userId = request.userId;
    const saleDeedId = request.params.saleDeedId;
    const contract = await getContract("saledeed", userId, "Org1MSP");
    let result = await contract.evaluateTransaction(
      "QuerySaleDeedById",
      saleDeedId
    );

    if (result.toString()) response.send(result);
    else response.send([]);
  } catch (error) {
    response.send(error);
  }
};

export const makeSaleDeedBuyer = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      id,
      khasraNumber,
      tehsil,
      district,
      state,
      amount,
      sellerId,
      buyerAadhaarFront,
      buyerAadhaarBack,
      buyerImage,
      buyerSignature,
    } = request.body;

    // console.log(sellerId);

    const contract = await getContract("saledeed", userId, "Org1MSP");
    let result = await contract.submitTransaction(
      "MakeSaleDeedRequestBuyer",
      id,
      khasraNumber,
      tehsil,
      district,
      state,
      amount,
      sellerId,
      userId,
      buyerAadhaarFront,
      buyerAadhaarBack,
      buyerImage,
      buyerSignature
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export const makeSaleDeedSeller = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      id,
      sellerAadhaarFront,
      sellerAadhaarBack,
      sellerImage,
      sellerSignature,
    } = request.body;

    const contract = await getContract("saledeed", userId, "Org1MSP");

    let result = await contract.submitTransaction(
      "MakeSaleDeedRequestSeller",
      id,
      sellerAadhaarFront,
      sellerAadhaarBack,
      sellerImage,
      sellerSignature
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export const queryRequestedSaleDeeds = async (request, response) => {
  try {
    const userId = request.userId;
    const khasraNumber = request.params.khasraNumber;
    const contract = await getContract("saledeed", userId, "Org1MSP");

    let result = await contract.evaluateTransaction(
      "QueryPendingSaleDeedsSeller",
      userId,
      khasraNumber
    );

    if (result.toString()) response.send(result);
    else response.send([]);
  } catch (error) {
    response.send(error);
  }
};

export const queryCompletedSaleDeeds = async (request, response) => {
  try {
    const userId = request.userId;
    const khasraNumber = request.params.khasraNumber;
    const contract = await getContract("saledeed", userId, "Org1MSP");

    let result = await contract.evaluateTransaction(
      "QueryCompletedSaleDeedsSeller",
      userId,
      khasraNumber
    );

    if (result.toString()) response.send(true);
    else response.send(false);
  } catch (error) {
    response.send(error);
  }
};

export const verifysignature = async (request, response) => {
  try {
    const userId = request.userId;
    const { user, saleDeedId, khasraNumber, userType } = request.body;

    const file = (saleDeedId + khasraNumber + user).toString();
    var hashToAction = SHA256(file);
    const identity = await getIdentity({ userId: user, org: "Org1MSP" });

    if (identity && identity.type === "X.509") {
      const contract = await getContract("saledeed", userId, "Org2MSP");
      let result = await contract.evaluateTransaction(
        "QuerySaleDeedById",
        saleDeedId
      );

      var resultJSON = JSON.parse(result);

      let signature;
      switch (userType) {
        case "seller":
          signature = resultJSON.sellerSignature;
          break;
        case "buyer":
          signature = resultJSON.buyerSignature;
          break;
      }

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

    const oldUser = await UserModal.findOne({ aadhaar: userId });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) response.send(false);
    else {
      const file = (saleDeedId + khasraNumber + userId).toString();

      var hashToAction = SHA256(file);
      const identity = await getIdentity({ userId: userId, org: "Org1MSP" });

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

export const rejectSaleDeed = async (request, response) => {
  try {
    const userId = request.userId;
    const orgMSP = request.orgMSP;
    const { saleDeedId } = request.params;

    await RequestModal.findByIdAndRemove(saleDeedId);

    const contract = await getContract("saledeed", userId, orgMSP);

    let result = await contract.submitTransaction("RejectSaleDeed", saleDeedId);

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export default router;
