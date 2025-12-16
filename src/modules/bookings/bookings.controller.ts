import { Request, Response } from "express";
import { usersService } from "./users.service";

const postBooking = async (req: Request, res: Response) => {
  try {
    const result = usersService.getUser;
    res.status(200).json({
      success: true,
      message: "User Created Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const result = usersService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: "User Updated Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBooking = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const result = usersService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "User Delete Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const bookingController = {
  postBooking,
  getBooking,
  updateBooking
};
