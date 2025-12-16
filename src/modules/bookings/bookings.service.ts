import { Pool } from "pg";
import config from "../../config";

const pool = new Pool({
  connectionString: config.connectionStr,
});

const postBooking = async () => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
        `);
    return result.rows[0];
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
