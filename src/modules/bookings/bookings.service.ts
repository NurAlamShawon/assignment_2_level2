import jwt, { JwtPayload } from "jsonwebtoken";
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
  status: string;
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
      `INSERT INTO bookings(status, total_price, rent_start_date, rent_end_date , customer_id ,vehicle_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING * `,
      ["active", cost, rent_start_date, rent_end_date, customer_id, vehicle_id]
    );

    if (result.rows.length === 0) {
      return "Vehicle is not found";
    } else {
      if (result2.rows.length === 0) {
        return "Booked is not completed";
      } else {
        return {
          data: {
            ...result2.rows[0],
            vehicle: result.rows[0],
          },
        };
      }
    }
  } catch (err) {
    return err;
  }
};

const updateBooking = async (token: string, id: string, vehicle_id: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  const role = decoded.role;

  const now = new Date();
  const record = await pool.query(
    `
SELECT * FROM bookings WHERE id=$1`,
    [id]
  );

  const { rent_start_date } = record.rows[0];

  try {
    if (role === "admin") {
      const result = await pool.query(
        `
UPDATE vehicle SET availability_status=$1 WHERE id=$2 RETURNING *`,
        ["available", vehicle_id]
      );

      const result2 = await pool.query(
        `
UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
        ["returned", id]
      );

      return {
        data: {
          ...result.rows[0],
          vehicle: result2.rows[0],
        },
      };
    }

    if (role === "user") {
      if (rent_start_date > now) {
        const result = await pool.query(
          `
UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
          ["cancelled", id]
        );

        const result2 = await pool.query(
          `
UPDATE vehicle SET availability_status=$1 WHERE id=$2 RETURNING *`,
          ["available", vehicle_id]
        );

        return {
          data: {
            ...result.rows[0],
          },
        };
      } else {
        return "Rent date has started";
      }
    }
  } catch (err) {
    return err;
  }
};

const getBooking = async (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  const role = decoded?.role;
  const email = decoded?.email;

  try {
    if (role === "admin") {
      const result = await pool.query(`
SELECT * FROM bookings`);
      return result;
    }

    if (role === "user") {
      const result = await pool.query(
        `
SELECT * FROM bookings WHERE email=$1`,
        [email]
      );

      return result;
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
