import { Pool } from "pg";
import config from "../../config";

const pool = new Pool({
  connectionString: config.connectionStr,
});

type BookingPayload = {
  availability_status: "available" | "booked";
  daily_rent_price: number;
  registration_number: string;
  customerId: string;
  vehicle_id: string;
  customer_id: string;
  rent_start_date: string;
  rent_end_date: string;
};

const postBooking = async (payload: BookingPayload) => {
  const {
    customer_id,
    availability_status,
    daily_rent_price,
    vehicle_id,
    rent_start_date,
    rent_end_date,
  } = payload;

  if (availability_status === "booked") {
    return "Vehicle is Booked";
  }

  const days =
    (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);

  const cost: number = daily_rent_price * days;

  try {
    const result = await pool.query(
      `
       UPDATE vehicles SET availability_status=$1 WHERE id=$2
        `,
      ["booked", vehicle_id]
    );

    const result2 = await pool.query(
      `INSERT INTO vehicles(status, total_price, rent_start_date, rent_end_date , customer_id ,vehicle_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING * `,
      ["active", cost, rent_start_date, rent_end_date, customer_id, vehicle_id]
    );

    if (result.rows.length === 0) {
      return "Vehicle is not found";
    } else {
      if (result2.rows.length === 0) {
        return "Booked is not completed";
      } else {
        return result2.rows[0];
      }
    }
  } catch (err) {
    return err;
  }
};

const updateBooking = async (id: string, payload: Record<string, unknown>) => {
  const { name, email, phone, role } = payload;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, role=$3, phone=$4 WHERE id=$5 RETURNING *`,
      [name, email, role, phone, id]
    );

    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (err) {
    return err;
  }
};

const getBooking = async (id: string) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    if (result.rows.length === 0) {
      return "User Not Found!";
    } else {
      return result.rows[0];
    }
  } catch (err) {
    return err;
  }
};

export const bookingService = {
  postBooking,
  getBooking,
  updateBooking,
};
