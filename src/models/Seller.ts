import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import conn from "@config/conn";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret";

class SellerModels {
  async login(user: string, password: string): Promise<{} | null> {
    return await conn.seller.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                email: user,
              },
              {
                cnpj: user,
              },
              {
                tel: user,
              },
            ],
          },
          {
            password,
          },
        ],
      },
      select: {
        password: false,
      },
    });
  }

  async auth(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const auth: string | undefined = request.headers.authorization;

    if (auth === undefined) {
      response.status(400).json({
        msg: "O token não foi encontrado.",
      });
      return;
    }

    const token = auth.split(" ")[1];

    await jwt.verify(
      token,
      JWT_SECRET,
      (
        err: jwt.VerifyErrors | null,
        seller: string | jwt.JwtPayload | undefined
      ): void => {
        if (err != null) {
          response.status(400).json({
            msg: "O token se expirou.",
          });
          return;
        }

        request.seller = seller;
        next();
      }
    );

    return;
  }
}

export default new SellerModels();
