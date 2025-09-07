import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './interfaces/authRequestUser';
import jwt from 'jsonwebtoken';



export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.tokenPokemonJournal;
  const JWT_SECRET = process.env.JWT_SECRET;


  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not defined' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
};