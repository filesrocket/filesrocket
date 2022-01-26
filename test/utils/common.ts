import { Request, Response } from "express";
import { ROCKET_RESULT } from "../../src/index";

export function handler(req: Request, res: Response): void {
  const data = (req as any)[ROCKET_RESULT];
  res.status(200).json(data);
}
