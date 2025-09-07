import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { excludeDeleted, softDeleteData, updateData, restoreData } from "../utils/softDelete";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, limit = 10, offset = 0 } = req.body;

    const whereClause = {
      ...excludeDeleted(),
      ...(search && {
        OR: [
          {
            firstName: {
              contains: search as string,
              mode: "insensitive" as const,
            },
          },
          {
            lastName: {
              contains: search as string,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search as string,
              mode: "insensitive" as const,
            },
          },
          {
            phone: {
              contains: search as string,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        take: Number(limit),
        skip: Number(offset),
        orderBy: {
          firstName: "asc",
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    res.status(200).json({
      users,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, passwordHash, phone, role, username } = req.body;
    
    // Generate a default username if not provided
    const defaultUsername = username || `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}` || `user_${Date.now()}`;
    
    // Generate a default password if not provided
    const defaultPassword = passwordHash || 'defaultPassword123';
    
    const user = await prisma.user.create({
      data: { 
        firstName, 
        lastName, 
        email, 
        username: defaultUsername,
        password: defaultPassword,
        passwordHash: defaultPassword, 
        phone, 
        role 
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" , error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, passwordHash, phone, role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: updateData({ firstName, lastName, email, passwordHash, phone, role }),
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: softDeleteData(),
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

const restoreUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: restoreData(),
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al restaurar el usuario" });
  }
};


export {
  getAllUsers,
  createUser,
  getUserById,  
  updateUser,
  deleteUser,
  restoreUser,
};
