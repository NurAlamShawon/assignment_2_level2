import { Pool } from "pg";
import config from "../../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: config.connectionStr,
});

const signUp = async (email: string, password: string, role: string) => {
  const hashPass = await bcrypt.hash(password as string, 10);

  try {
    const result = await pool.query(
      `
        INSERT INTO users(email,password,role) VALUES($1,$2,$3) RETURNING *
        `,
      [email, hashPass, role]
    );
    return result.rows[0];
  } catch (err) {
    return err;
  }
};

const signIn = async (email: string, password: string) => {
  try {
    const result = await pool.query(
      `
       SELECT * FROM users WHERE email=$1
        `,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }
    const user = result.rows[0];
    const secret = config.secret || "your_secret_key";
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    return { token, user };
  } catch (err) {
    return err;
  }
};

export const authSevice = {
  signUp,
  signIn,
};
