import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import connectDb from "./src/config/db.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import { generalLimiter } from "./src/middlewares/rateLimit.middleware.js";
import userRouter from "./src/routes/userroutes.js";
const app = express();
connectDb();
const PORT = process.env.PORT || 8086;
app.use(cors());
app.use(helmet());

app.use(express.json());
app.set("trust proxy", 1);

//rate limiter
app.use(generalLimiter);

//register routes
app.use("/api/user/", userRouter);

//middlewar for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
