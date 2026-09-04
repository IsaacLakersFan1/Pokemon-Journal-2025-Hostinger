import { Response, NextFunction } from "express";
import { AuthRequest } from "./interfaces/authRequestUser";
import { COOKIE_NAME, verifyAuthToken } from "../utils/jwt";

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    res.status(401).json({ message: "No hay sesión activa" });
    return;
  }

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Sesión inválida o expirada" });
    return;
  }
};
