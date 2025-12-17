import { Request, Response } from "express";
import { bookingService } from "./bookings.service";


const postBooking = async (req: Request, res: Response) => {
  try {
    const result = bookingService.postBooking(req.body);
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
  const { id } = req.params as { id: string };

  try {
    const result = bookingService.updateBooking(id, req.body);
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
  const { id } = req.body.;

  try {
    const result = bookingService.getBooking(id);
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
