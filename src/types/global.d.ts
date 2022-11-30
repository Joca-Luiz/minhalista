import { JwtPayload } from "jsonwebtoken";

export {};
declare global {
  namespace Express {
    interface Request {
      buyer: String | JwtPayload | undefined;
      seller: String | JwtPayload | undefined;
    }
  }
}
