import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret";

export async function authBuyer(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const auth: string | undefined = request.headers.authorization;

  if (auth === "" || auth === undefined) {
    response.status(400).json({
      msg: "Token não encontrado.",
    });
    return;
  }

  const token: string = auth.split(" ")[1];

  jwt.verify(
    token,
    JWT_SECRET,
    (
      err: jwt.VerifyErrors | null,
      buyer: string | jwt.JwtPayload | undefined
    ): void => {
      if (err != null) {
        response.status(400).json({
          msg: "O token se expirou.",
        });
        return;
      }

      request.buyer = buyer;
      next();
      return;
    }
  );

  return;
}
