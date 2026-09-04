import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prismaClient";
import { z } from "zod";
import {
  COOKIE_NAME,
  COOKIE_OPTIONS,
  signAuthToken,
  verifyAuthToken,
} from "../utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
} as const;

const signup = async (req: Request, res: Response): Promise<void> => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Datos de registro inválidos" });
    return;
  }
  const { email, password, firstName, lastName } = result.data;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Este correo ya está en uso" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username: email,
        password: hashedPassword,
        passwordHash: hashedPassword,
        firstName,
        lastName,
      },
      select: publicUserSelect,
    });

    res
      .status(201)
      .json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: "Correo o contraseña inválidos" });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "Correo o contraseña incorrectos" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash || user.password
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: "Correo o contraseña incorrectos" });
      return;
    }

    const token = signAuthToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ message: "No hay sesión activa" });
      return;
    }

    const decoded = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: publicUserSelect,
    });

    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Sesión inválida o expirada" });
  }
};

/** Returns the current cookie token so the client can store it for multi-account switching. */
const persistSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ message: "No hay sesión activa" });
      return;
    }

    const decoded = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: publicUserSelect,
    });

    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Sesión inválida o expirada" });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
      path: COOKIE_OPTIONS.path,
    });
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const switchAccount = async (req: Request, res: Response): Promise<void> => {
  const token = req.body?.token;
  if (!token || typeof token !== "string") {
    res.status(400).json({ message: "Se requiere el token de la cuenta" });
    return;
  }
  try {
    const decoded = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: publicUserSelect,
    });
    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }
    // Re-issue a fresh token so the session stays valid and storage stays in sync
    const freshToken = signAuthToken(user.id);
    res.cookie(COOKIE_NAME, freshToken, COOKIE_OPTIONS);
    res.status(200).json({
      message: "Cuenta cambiada correctamente",
      token: freshToken,
      user,
    });
  } catch (error) {
    console.error(error);
    const expired =
      error instanceof Error && error.name === "TokenExpiredError";
    res.status(401).json({
      message: expired
        ? "La sesión de esa cuenta expiró. Vuelve a iniciar sesión para agregarla de nuevo."
        : "No se pudo cambiar de cuenta. El token es inválido o expiró.",
    });
  }
};

export { login, signup, me, logout, switchAccount, persistSession };
