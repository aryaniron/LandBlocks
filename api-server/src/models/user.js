import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  aadhaar: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  pincode: { type: String, required: true },
  villageOrCity: { type: String, required: true },
  district: { type: String, required: true },
  stateOrUt: { type: String, required: true },
  image: { type: String },
});

export default mongoose.model("User", userSchema);
