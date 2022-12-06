import app from "@config/app";
import dotenv from "dotenv";
import buyerRouter from "@controllers/buyer";
import sellerRouter from "@controllers/seller";

dotenv.config();

app.use("/buyer", buyerRouter);
app.use("/seller", sellerRouter);

const port: number | string = process.env.PORT ?? 3000;
app.listen(port);
