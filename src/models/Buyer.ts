import conn from "@config/conn";
import bcript from "bcrypt";
import { Buyer } from "@prisma/client";

class BuyerModels {
  async login(
    user: string,
    password: string,
    bcriptRounds: number = 10
  ): Promise<Buyer | null> {
    bcript.genSalt(
      bcriptRounds,
      (err: Error | undefined, salt: string): void => {
        if (err === undefined) return;
        bcript.hash(
          password,
          salt,
          (err: Error | undefined, p: string): void => {
            if (err === undefined) return;
            password = p;
          }
        );
      }
    );

    return conn.buyer.findFirst({
      where: {
        AND: [
          {
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
          {
            password,
          },
        ],
      },
    });
  }

  async create(buyer: Buyer, bcriptRounds: number = 10): Promise<Buyer | null> {
    bcript.genSalt(
      bcriptRounds,
      (err: Error | undefined, salt: string): void => {
        if (err === undefined) return;
        bcript.hash(
          buyer.password,
          salt,
          (err: Error | undefined, password: string): void => {
            if (err === undefined) return;
            buyer.password = password;
          }
        );
      }
    );

    return conn.buyer.create({
      data: buyer,
    });
  }

  async userIsAlreadyRegistered(
    email: string,
    cpf: string,
    tel: string
  ): Promise<Buyer | null> {
    return conn.buyer.findFirst({
      where: {
        email,
        OR: {
          cpf,
          OR: {
            tel,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<Buyer | never> {
    return conn.buyer.delete({
      where: {
        id,
      },
    });
  }
}

export default new BuyerModels();
