import { NextFunction, Request, Response } from "express";
import { validationResult, Result, ValidationError } from "express-validator";

export async function validator(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const errors: Result<ValidationError> = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json(errors.array()[0]);
    return;
  }

  next();
  return;
}
