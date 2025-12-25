import jwt, { JwtPayload } from "jsonwebtoken";
import { Pool } from "pg";
import config from "../../config";

const pool = new Pool({
  connectionString: config.connectionStr,
});

const getUser = async () => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    return err;
  }
};

const updateUser = async (
  id: Number,
  payload: Record<string, unknown>,
  token: string
) => {
  const { name, email, phone, role } = payload;

  const decode = jwt.decode(token) as JwtPayload;
  const userRole = decode?.role;
  const userEmail = decode?.email;

  console.log(name, email, phone, role, id);
  console.log(userRole);

  try {
    //admin part
    if (userRole === "admin") {
      const result = await pool.query(
        `UPDATE users SET name=$1, email=$2, role=$3, phone=$4 WHERE id=$5 RETURNING *`,
        [name, email, role, phone, id]
      );

      console.log(result);
      if (result.rows.length === 0) {
        return "User not found";
      } else {
        return result.rows;
      }
    }
    //customer
    if (userRole === "customer") {
      if (userEmail == email) {
        const result = await pool.query(
          `UPDATE users SET name=$1, email=$2, role=$3, phone=$4 WHERE id=$5 RETURNING *`,
          [name, email, role, phone, id]
        );

        console.log(result);
        if (result.rows.length === 0) {
          return "User not found";
        } else {
          return result.rows;
        }
      } else {
        return "You don't have access to do it!";
      }
    }
  } catch (err) {
    return err;
  }
};

const deleteUser = async (id: Number, token: string) => {
  const decode = jwt.decode(token) as JwtPayload;
  const userRole = decode?.role;

  try {
    if (userRole === "admin") {
      const test = await pool.query(
        `SELECT * FROM bookings WHERE customer_id=$1`,
        [id]
      );
      console.log("booking",test)

      if ( (test.rowCount === 0) || (!(test.rows[0].status === "active"))) {
        const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

        console.log(result)

        if (result.rowCount === 1) {
        return result.command;
      } else {
        return "Unsuccessfull";
      }
      }
    }
    else{
      return "You don't have access to delete user!"
    }
  } catch (err) {
    return err;
  }
};

export const usersService = {
  getUser,
  updateUser,
  deleteUser,
};
