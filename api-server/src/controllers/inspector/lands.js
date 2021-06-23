import express from "express";
const router = express.Router();
import { getContract } from "../../Utils/getContract.js";

export const getLand = async (request, response) => {
  try {
    const userId = request.userId;
    const { khasraNumber } = request.params;
    const contract = await getContract("land", userId, "Org2MSP");
    let result = await contract.evaluateTransaction(
      "QueryLandById",
      khasraNumber
    );

    if (result.toString()) response.send(result);
    else response.send("No Land for this KhasraNumber");
  } catch (error) {
    response.send(error);
  }
};

export const getLands = async (request, response) => {
  try {
    const userId = request.userId;
    const { tehsil, district, state } = request.params;
    const contract = await getContract("land", userId, "Org2MSP");
    let result = await contract.evaluateTransaction(
      "QueryLandsByTehsil",
      tehsil,
      district,
      state
    );

    if (result.toString()) response.send(result);
    else response.send([]);
  } catch (error) {
    response.send(error);
  }
};

export const addLand = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      khasraNumber,
      ownerId,
      area,
      titleDeedId,
      regdate,
      typeOf,
      encumbrance,
      street,
      pincode,
      villageOrCity,
      tehsil,
      district,
      division,
      stateOrUt,
      points,
    } = request.body;
    const contract = await getContract("land", userId, "Org2MSP");
    let result = await contract.submitTransaction(
      "AddLand",
      khasraNumber,
      ownerId,
      area,
      titleDeedId,
      regdate,
      typeOf,
      encumbrance,
      street,
      pincode,
      villageOrCity,
      tehsil,
      district,
      division,
      stateOrUt,
      points
    );
    response.send(true);
  } catch (error) {
    response.send(false);
  }
};

export const getLandHistory = async (request, response) => {
  try {
    const userId = request.userId;
    const khasraNumber = request.params.khasraNumber;
    const contract = await getContract("land", userId, "Org2MSP");
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

export const transferLand = async (request, response) => {
  try {
    const userId = request.userId;
    const { khasraNumber, newOwnerId, newTitleDeedId, newRegisterationDate } =
      request.body;
    const contract = await getContract("land", userId, "Org2MSP");
    let result = await contract.submitTransaction(
      "TransferLand",
      khasraNumber,
      newOwnerId,
      newTitleDeedId,
      newRegisterationDate
    );

    response.send(result);
  } catch (error) {
    response.send(error);
  }
};

export default router;
