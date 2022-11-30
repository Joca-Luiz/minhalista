import conn from "@config/conn";
import bcript from "bcrypt";
import { Buyer } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret";

class BuyerModels {
  async login(user: string, password: string): Promise<Buyer | null> {
    return await new Promise((resolve, reject): void => {
      conn.buyer
        .findFirst({
          where: {
            OR: [
              {
                email: user,
              },
              {
                cpf: user,
              },
              {
                tel: user,
              },
            ],
          },
        })
        .then(async (buyer: Buyer | null): Promise<void> => {
          if (buyer == null) {
            resolve(null);
            return;
          }

          await bcript.compare(password, buyer.password).then((logged) => {
            if (logged) {
              resolve(buyer);
              return;
            }

            resolve(null);
          });
        })
        .catch((e) => reject(e));
      return;
    });
  }

  async create(buyer: Buyer): Promise<Buyer | null> {
    return await new Promise((resolve, reject) => {
      this.encrypt(buyer.password)
        .then((password: string): void => {
          buyer.password = password;
          resolve(
            conn.buyer.create({
              data: buyer,
            })
          );
        })
        .catch((e) => reject(e));
    });
  }

  async delete(id: number): Promise<Buyer | never> {
    return await conn.buyer.delete({
      where: {
        id,
      },
    });
  }

  async auth(
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

  async buyerIsAlreadyRegistered(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const email: string | undefined = request.body.email;
    const cpf: string | undefined = request.body.cpf;
    const tel: string | undefined = request.body.tel;

    const value: string | undefined = request.params.value;

    if (value === undefined) {
      await conn.buyer
        .findFirst({
          where: {
            email,
            OR: {
              cpf,
              OR: {
                tel,
              },
            },
          },
        })
        .then((buyer: Buyer | null): void => {
          if (buyer === null) {
            next();
            return;
          }

          response.status(400).json({
            msg: "O usuário já está cadastrado, tente fazer login.",
          });
          return;
        });
      return;
    }

    await conn.buyer
      .findFirst({
        where: {
          OR: [
            {
              email: value,
            },
            {
              cpf: value,
            },
            {
              tel: value,
            },
          ],
        },
      })
      .then((buyer: Buyer | null): void => {
        if (buyer === null) {
          next();
          return;
        }

        response.status(400).json({
          msg: "Usuário já cadastrado.",
        });
      });

    return;
  }

  async encrypt(password: string, rounds: number = 10): Promise<string> {
    return await new Promise((resolve) => {
      bcript.genSalt(rounds, (err: Error | undefined, salt: string): void => {
        if (err !== undefined) return;
        bcript.hash(
          password,
          salt,
          (err: Error | undefined, password: string): void => {
            if (err !== undefined) return;
            resolve(password);
          }
        );
      });
    });
  }
}

export default new BuyerModels();
