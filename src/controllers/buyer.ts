import { Buyer } from "@prisma/client";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { validator } from "@middlewares/validator";
import BuyerModels from "@models/Buyer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();
const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret";

router.get(
  "/",
  BuyerModels.auth,
  (request: Request, response: Response): void => {
    const buyer: jwt.JwtPayload | String | undefined = request.buyer;
    response.status(200).json({
      success: true,
      buyer,
    });
    return;
  }
);

router.get(
  "/alreadySingup/:value",
  BuyerModels.buyerIsAlreadyRegistered,
  (request: Request, response: Response) => {
    response.status(200).json({
      success: true,
    });
  }
);

router.post(
  "/login",
  body("user").notEmpty(),
  body("password").notEmpty(),
  validator,
  async (request: Request, response: Response): Promise<void> => {
    const user: string = request.body.user;
    const password: string = request.body.password;

    await BuyerModels.login(user, password).then(
      (buyer: Buyer | null): void => {
        if (buyer == null) {
          response.status(400).json({
            msg: "Usuário não encontrado",
          });
          return;
        }

        const token: string = jwt.sign(buyer, JWT_SECRET, {
          expiresIn: "1h",
        });

        response.status(200).json({
          success: true,
          token,
        });

        return;
      }
    );
    return;
  }
);

router.post(
  "/",
  body("name").notEmpty().isLength({ max: 191, min: 5 }),
  body("email").normalizeEmail().isEmail().isLength({ max: 255 }),
  body("cpf").isLength({ max: 14, min: 14 }),
  body("tel").isLength({ max: 15, min: 8 }),
  body("cep").isLength({ max: 9, min: 9 }),
  body("number").isLength({ max: 10, min: 1 }),
  body("address").isLength({ max: 191, min: 5 }),
  body("city").isLength({ max: 191, min: 5 }),
  body("uf").isLength({ max: 2, min: 2 }),
  body("complement").isLength({ max: 191, min: 5 }),
  body("password").isLength({ max: 191, min: 5 }),
  validator,
  BuyerModels.buyerIsAlreadyRegistered,
  async (request: Request, response: Response): Promise<void> => {
    const buyerValues: Buyer = request.body;
    await BuyerModels.create(buyerValues).then((buyer: Buyer | null): void => {
      response.status(201).json({
        success: true,
        buyer,
      });
      return;
    });
    return;
  }
);

router.delete(
  "/",
  BuyerModels.auth,
  async (request: Request, response: Response): Promise<void> => {
    const id: number = (request.buyer as Buyer).id;
    BuyerModels.delete(id)
      .then((buyer): void => {
        response.status(200).json({
          success: true,
          buyer,
        });
        return;
      })
      .catch((e) => {
        response.status(500).json({
          msg: "O token não foi atualizado.",
        });
        return;
      });
    return;
  }
);

export default router;
