import { Request, Response } from "express";
import  bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "isaacBasketballTracker2025";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  const signupSchema = z.object({
    email: z.string().email(),
    // username: z.string().min(3),
    password: z.string().min(6),
    firstName: z.string().min(3),
    lastName: z.string().min(3)
  });

const signup = async (req: Request, res: Response): Promise<void> => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Invalid input" });
        return;
    }
    const { email,  password, firstName, lastName } = result.data;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(400).json({ message: "Email already in use" });
          return;
        }

        const existingUsername = await prisma.user.findUnique({ where: { email } });
        if (existingUsername) {
          res.status(400).json({ message: "Username already in use" });
          return;
        }
        
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { 
                email, 
                username: email,
                password: hashedPassword, // Keep using password column for now
                passwordHash: hashedPassword, // Also store in passwordHash
                firstName, 
                lastName 
            }
        });
    
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req: Request, res: Response): Promise<void> => {

    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
       res.status(400).json({ message: "Invalid input" });
       return;
    }

    const { email, password } = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash || user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
        res.cookie("tokenPokemonJournal", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
          });
        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.tokenPokemonJournal;
        
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("tokenPokemonJournal");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    login,
    signup,
    me,
    logout
}

