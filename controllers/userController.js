import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import path from "path";

const usersFile = path.resolve("data/users.json");

// Helpers
const readUsers = async () => JSON.parse(await fs.readFile(usersFile, "utf-8"));
const writeUsers = async (data) =>
  await fs.writeFile(usersFile, JSON.stringify(data, null, 2));

// Register Controller
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const users = await readUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuid(),
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
