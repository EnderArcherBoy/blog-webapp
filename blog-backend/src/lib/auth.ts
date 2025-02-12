import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string;

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as { id: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function getUserFromAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    
    return await prisma.user.findUnique({ where: { id: decoded.id } });
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
