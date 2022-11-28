import app from "@config/app";
import dotenv from "dotenv";
import buyerRouter from "@controllers/buyer";

dotenv.config();

app.use("/buyer", buyerRouter);

const port: number | string = process.env.PORT ?? 3000;
app.listen(port);
