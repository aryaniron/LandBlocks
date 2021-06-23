import mongoose from "mongoose";

const inspectorSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  aadhaar: { type: String, required: true },
  password: { type: String, required: true },
  tehsil: { type: String, required: true },
  district: { type: String, required: true },
  stateOrUt: { type: String, required: true },
  image: { type: String },
});

export default mongoose.model("Inspector", inspectorSchema);
