import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateAccessToken } from "../utils/jwt";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.login(email, password);

  if (user) {
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await authService.updateUser(username, req.body);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleteUser = await authService.deleteUserById(id);

  if (deleteUser) {
    res.json({
      message: "Account Deleted Successfully",
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};
