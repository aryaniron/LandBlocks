import express from "express";
const router = express.Router();
import RequestModal from "../../models/request.js";
import mongoose from "mongoose";

export const getRequestsForMyLand = async (req, res) => {
  try {
    const khasraNumber = req.params.khasraNumber;
    const requests = await RequestModal.find({
      khasraNumber: khasraNumber,
      status: false,
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInfoRequest = async (req, res) => {
  const request = {
    khasraNumber: req.params.khasraNumber,
    requester: req.userId,
    requestFor: "info",
  };
  const newRequest = new RequestModal(request);
  try {
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createBuyRequest = async (req, res) => {
  const request = {
    khasraNumber: req.params.khasraNumber,
    requester: req.userId,
    requestFor: "buy",
  };
  const newRequest = new RequestModal(request);
  try {
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  const { requestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(requestId))
    return res.status(404).send(`No request with id: ${requestId}`);

  let request = await RequestModal.findOne({ _id: requestId });
  // const updatedRequest = {
  //   requestFor : request.re,
  //   khasraNumber,
  //   requester,
  //   requested,
  //   _id: id,
  //   status: true,
  //   timeStamp: new Date(),
  // };
  request.status = true;
  request.timeStamp = new Date();

  await RequestModal.findByIdAndUpdate(requestId, request, { new: true });

  res.json(request);
};

export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(requestId))
    return res.status(404).send(`No post with id: ${requestId}`);
  let request = await RequestModal.findOne({ _id: requestId });

  await RequestModal.findByIdAndRemove(requestId);

  res.json(request);
};

export const getInfoRequest = async (req, res) => {
  const userId = req.userId;
  const { khasraNumber } = req.params;
  try {
    const request = await RequestModal.findOne({
      khasraNumber: khasraNumber,
      requester: userId,
      requestFor: "info",
    });
    res.status(200).json(request);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getBuyRequest = async (req, res) => {
  const userId = req.userId;
  const { khasraNumber } = req.params;
  try {
    const request = await RequestModal.findOne({
      khasraNumber: khasraNumber,
      requester: userId,
      requestFor: "buy",
    });
    res.status(200).json(request);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
