import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import errorHandler from "./src/middlewares/error.middleware.js";
import { generalLimiter } from "./src/middlewares/rateLimit.middleware.js";
const app = express();
const PORT = process.env.PORT || 8086;
app.use(cors());
app.use(helmet());

app.use(express.json());
app.set("trust proxy", 1);

//rate limiter
app.use(generalLimiter);

//register routes

//middlewar for error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
