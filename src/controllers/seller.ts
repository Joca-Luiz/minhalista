import jwt from "jsonwebtoken";
import { validator } from "@middlewares/validator";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import SellerModels from "@models/Seller";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

router.post(
  "/login",
  body("user").notEmpty(),
  body("password").notEmpty(),
  validator,
  async (request: Request, response: Response): Promise<void> => {
    const user: string = request.body.user;
    const password: string = request.body.password;

    await SellerModels.login(user, password).then((seller: {} | null): void => {
      if (seller == null) {
        response.status(400).json({
          msg: "Usuário não encontrado.",
        });
        return;
      }

      const token = jwt.sign(seller, JWT_SECRET, {
        expiresIn: "1h",
      });

      response.status(200).json({
        success: true,
        token,
      });
      return;
    });
    return;
  }
);

router.get(
  "/",
  SellerModels.auth,
  async (request: Request, response: Response): Promise<void> => {
    response.status(200).json({
      success: true,
      seller: request.seller,
    });
  }
);

export default router;
