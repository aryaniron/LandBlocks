import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
  khasraNumber: String,
  requester: String,
  requestFor: { type: String, default: "info" },
  status: { type: Boolean, default: false },
  timeStamp: { type: Date, default: new Date() },
});

export default mongoose.model("Request", requestSchema);
