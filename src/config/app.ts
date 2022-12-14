import express from "express";
import cors from "cors";
import helmet from "helmet";

const app: express.Application = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;
