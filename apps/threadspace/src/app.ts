import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import errorHandler from "./middlewares/error.middleware";
import { generalLimiter } from "./middlewares/rateLimit.middleware";

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.set("trust proxy", 1);

//rate limiter
app.use(generalLimiter);

//register routes

//middlewar for error handling
app.use(errorHandler);

export default app;
