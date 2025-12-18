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
  vehicle_id: number;
  customer_id: number;
  rent_start_date: string;
  rent_end_date: string;
  status: string;
};

const postBooking = async (payload: BookingPayload) => {
  const {
    customer_id,
    daily_rent_price,
    vehicle_id,
    rent_start_date,
    rent_end_date,
  } = payload;

  const test = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  console.log("test", test);
  console.log(
    "data",
    customer_id,
    daily_rent_price,
    vehicle_id,
    rent_start_date,
    rent_end_date
  );

  if (test.rows[0].availability_status === "booked") {
    return "Vehicle is Already Booked!";
  }

  const days =
    (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);

  const cost: number = daily_rent_price * days;

  try {
    const result = await pool.query(
      `
       UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *
        `,
      ["booked", vehicle_id]
    );

    console.log(result);

    const result2 = await pool.query(
      `INSERT INTO bookings(status, total_price, rent_start_date, rent_end_date , customer_id ,vehicle_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING * `,
      ["active", cost, rent_start_date, rent_end_date, customer_id, vehicle_id]
    );

    console.log(result2);

    if (result.rows.length === 0) {
      return "Vehicle is not found";
    } else {
      if (result2.rows.length === 0) {
        return "Booked is not completed";
      } else {
        return {
          data: {
            ...result2.rows[0],
            vehicle: {
              vehicle_name: result.rows[0].vehicle_name,
              type: result.rows[0].type,
              registration_number: result.rows[0].registration_number,
              daily_rent_price: result.rows[0].daily_rent_price,
            },
          },
        };
      }
    }
  } catch (err) {
    return err;
  }
};

const updateBooking = async (token: string, id: Number, vehicle_id: Number) => {
  const decoded = jwt.decode(token) as JwtPayload;
  const role = decoded.role;

  const now = new Date();
  const record = await pool.query(
    `
SELECT * FROM bookings WHERE id=$1`,
    [id]
  );

  const { rent_start_date } = record.rows[0];
  const rentStart = new Date(rent_start_date);

  try {
    if (role === "admin") {
      const result = await pool.query(
        `
UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
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

    if (role === "customer") {
      if (rentStart > now) {
        const result = await pool.query(
          `
UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
          ["cancelled", id]
        );

        const result2 = await pool.query(
          `
UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
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
      return result.rows;
    }

    if (role === "customer") {
      const result0 = await pool.query(
        `
SELECT * FROM users WHERE email=$1`,
        [email]
      );

      const result = await pool.query(
        `
SELECT * FROM bookings WHERE customer_id=$1`,
        [result0.rows[0].id]
      );

      return result.rows;
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
