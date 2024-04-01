import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

// locals imports
import userRouter from "./routes/auth.js";
import userDataRouter from "./routes/users.js";
import transactionRouter from "./routes/transactions.js";
import exchangeRouter from "./routes/exchange.js"
import messagesRouter from "./routes/control.js"
import compression from "compression";
import { dataBaseConnect } from "./config/db.js"


// initialise the app
const app = express();

dotenv.config();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


// route
app.use("/api/auth", userRouter);
app.use("/api/users", userDataRouter);
app.use("/api/ctr", transactionRouter);
app.use("/api/exchange", exchangeRouter);
app.use("/api/messages", messagesRouter);


console.log("----  AURABET API V1.1.1  ----");

// mongodb connection
dataBaseConnect()


// server listening PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`- Server listening @ port:${PORT}`);
});
