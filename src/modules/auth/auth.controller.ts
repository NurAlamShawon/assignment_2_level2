import { Request, Response } from "express";
import { authSevice } from "./auth.services";

const signUp = async (req: Request, res: Response) => {
  const { email, password, role } = req.body as {
    email: string;
    password: string;
    role: string;
  };

  const result = await authSevice.signUp(email, password, role);

  try {
    res.status(200).json({
      success: true,
      message: "User Created Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
    role: string;
  };

  const result = await authSevice.signIn(email, password);

  try {
    res.status(200).json({
      success: true,
      message: "User Created Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const authController = {
  signUp,signIn
};
