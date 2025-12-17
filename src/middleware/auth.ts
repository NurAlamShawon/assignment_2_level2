import jwt from "jsonwebtoken";
import config from "../config";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  userId: string;
  role: string;
}

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(
        token,
        config.secret as string
      ) as AuthPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default auth;
