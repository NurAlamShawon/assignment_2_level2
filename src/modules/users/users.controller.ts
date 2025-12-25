import { Request, Response } from "express";
import { usersService } from "./users.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getUser();
    res.status(200).json({
      success: true,
      message: "User List Fetch Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.userId);

  const token: string | undefined = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const result = await usersService.updateUser(id, req.body, token);
  try {
    res.status(200).json({
      success: true,
      message: "User Updated Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: result,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.userId);

  const token: string | undefined = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await usersService.deleteUser(id, token);
    res.status(200).json({
      success: true,
      message: "User Delete Succesfully!",
      data: `Id:${id} is ${result} Succesfully`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const userController = {
  getUser,
  updateUser,
  deleteUser,
};
