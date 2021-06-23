import express from "express";
const app = express();

import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import usersRouter from "./routes/citizen/users.js";
import landsRouter from "./routes/citizen/lands.js";
import requestsRouter from "./routes/citizen/requests.js";
import saleDeedsRouter from "./routes/citizen/saleDeeds.js";

import usersRouterInspector from "./routes/inspector/users.js";
import landsRouterInspector from "./routes/inspector/lands.js";
import saleDeedsRouterInspector from "./routes/inspector/saleDeeds.js";

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.options("*", cors());
app.use(cors());

const PORT = process.env.PORT || 4000;
const CONNECTION_URL = "mongodb://mongo:27017/db";
//"mongodb+srv://hyperledger:hyperledger123@cluster0.omve6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

app.use("/lands", landsRouter);
app.use("/users", usersRouter);
app.use("/requests", requestsRouter);
app.use("/saledeeds", saleDeedsRouter);

app.use("/inspector/lands", landsRouterInspector);
app.use("/inspector/users", usersRouterInspector);
app.use("/inspector/saledeeds", saleDeedsRouterInspector);
