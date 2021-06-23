import jwt from "jsonwebtoken";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodedData;
    decodedData = jwt.verify(token, secret);
    req.userId = decodedData?.userId;
    req.orgMSP = decodedData?.orgMSP;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
