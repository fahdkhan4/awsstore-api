import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.login(email, password);

  if (user) {
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({ accessToken, refreshToken });
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

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token not provided" });

  const user = verifyRefreshToken(refreshToken);

  if (!user) return res.status(401).json({ error: "Invalid refresh token" });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  // Send the new tokens to the client
  res.json({ accessToken, refreshToken: newRefreshToken });
};
