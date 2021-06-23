import express from "express";
const router = express.Router();
import { getContract } from "../../Utils/getContract.js";

export const getMyLands = async (request, response) => {
  try {
    const userId = request.userId;
    const contract = await getContract("land", userId, "Org1MSP");
    let result = await contract.evaluateTransaction(
      "QueryLandsByOwner",
      userId
    );

    if (result.toString()) response.send(result);
    else response.send("No Lands");
  } catch (error) {
    response.send(error);
  }
};

export const markMyLandForSale = async (request, response) => {
  try {
    const userId = request.userId;

    const { khasraNumber, price } = request.params;
    const contract = await getContract("land", userId, "Org1MSP");
    let result = await contract.submitTransaction(
      "ForSale",
      khasraNumber,
      "true",
      price
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export const unmarkMyLandForSale = async (request, response) => {
  try {
    const userId = request.userId;
    const { khasraNumber } = request.params;
    const contract = await getContract("land", userId, "Org1MSP");
    let result = await contract.submitTransaction(
      "ForSale",
      khasraNumber,
      "false",
      "null"
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export const getLandsForSale = async (request, response) => {
  try {
    const userId = request.userId;
    const contract = await getContract("land", userId, "Org1MSP");
    let result = await contract.evaluateTransaction(
      "QueryLandsForSale",
      "true"
    );

    if (result.toString()) response.send(result);
    else throw `No Lands`;
  } catch (error) {
    response.send(error);
  }
};

export const getLandHistory = async (request, response) => {
  try {
    const userId = request.userId;
    const orgMSP = request.orgMSP;
    const khasraNumber = request.params.khasraNumber;
    const contract = await getContract("land", userId, orgMSP);
    let result = await contract.evaluateTransaction(
      "GetLandHistory",
      khasraNumber
    );

    console.log(result);
    if (result.toString()) response.send(result);
    else throw `No Lands for Sale`;
  } catch (error) {
    response.send(error);
  }
};

export default router;
