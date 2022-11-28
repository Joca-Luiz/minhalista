import { Buyer } from "@prisma/client";
import BuyerModels from "@models/Buyer";
import { Request, Response, NextFunction } from "express";

export async function userIsAlreadyRegistered(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const email: string = request.body.email;
  const cpf: string = request.body.cpf;
  const tel: string = request.body.tel;

  await BuyerModels.userIsAlreadyRegistered(email, cpf, tel).then(
    (buyer: Buyer | null): void => {
      if (buyer === null) {
        next();
        return;
      }

      response.status(400).json({
        msg: "O usuário já está cadastrado, tente fazer login.",
      });
      return;
    }
  );

  return;
}
