import jwt from "jsonwebtoken";

export const JWT_SECRET =
  process.env.JWT_SECRET || "isaacBasketballTracker2025";

export const COOKIE_NAME = "tokenPokemonJournal";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/",
};

export type JwtPayload = { userId: number };

export function signAuthToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyAuthToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
