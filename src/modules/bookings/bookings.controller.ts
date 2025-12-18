import { Request, Response } from "express";
import { bookingService } from "./bookings.service";


const postBooking = async (req: Request, res: Response) => {
  try {
    const result =await bookingService.postBooking(req.body);
    res.status(200).json({
      success: true,
      message: "Booking Succesfully!",
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
    const id = Number(req.params.bookingId);

    const token : string | undefined =req.headers.authorization;


  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

  const {vehicle_id}=req.body;

  try {
    const result =await bookingService.updateBooking(token,id,vehicle_id);
    res.status(200).json({
      success: true,
      message: "Bookings Updated Succesfully!",
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
   const token : string | undefined =req.headers.authorization;


  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }


  try {
    const result =await bookingService.getBooking(token);
    res.status(200).json({
      success: true,
      message: "Get Booking Data Successfully!",
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
