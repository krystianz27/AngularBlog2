import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const secretKey = process.env.JWT_SECRET_KEY!;

export function generateToken(userId: number, expiresIn = "12h"): string {
  const payload = { userId };
  const token = jwt.sign(payload, secretKey, {
    expiresIn,
  });
  return token;
}

export function encryptPassword(password: string): string {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

export function comparePassword(
  password: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: Function
) {
  const token = req.header("authorization")?.replace("Bearer", "").trim();
  if (!token) {
    res.status(401).json({ message: "Access denied. Token not provided." });
    return;
  }

  await authenticateJWT_admin(res, req, next, token);

  // const verified = verifyToken(token);

  // if (!verified) {
  //   res.status(403).json({ message: "Invalid token" });
  //   return;
  // }

  // try {
  //   const user = await User.findByPk((verified as any).userId);

  //   if (!user) {
  //     res.status(403).json({ message: "User not found" });
  //     return;
  //   }

  //   (req as any).user = user;
  //   next();
  // } catch (error) {
  //   res.status(500).json({ message: "Server error" });
  //   return;
  // }
}

export async function authenticateJWTOptional(
  req: Request,
  res: Response,
  next: Function
) {
  const token = req.header("authorization")?.replace("Bearer", "").trim();

  await authenticateJWT_admin(res, req, next, token);
}

async function authenticateJWT_admin(
  res: Response,
  req: Request,
  next: Function,
  token?: string
) {
  if (!token) {
    next();
    return;
  }
  const verified = verifyToken(token);

  if (!verified) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }

  try {
    const user = await User.findByPk((verified as any).userId);

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
}

// export function authenticateJWT(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const token = req.header("authorization")?.replace("Bearer", "").trim();
//   if (!token) {
//     res.status(401).json({ message: "Acces denied" });
//     return;
//   }

//   const verified = verifyToken(token);

//   if (!verified) {
//     res.status(403).json({ message: "Invalid token" });
//     return;
//   }

//   User.findByPk((verified as any).userId).then((user) => {
//     if (user) {
//       (req as any).user = user;
//       next();
//     } else {
//       res.status(403).json({ message: "User not found" });
//       return;
//     }
//   });
// }
