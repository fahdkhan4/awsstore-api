import { Request, Response } from "express";
import { UserService } from "../service/user.service";

const userService = new UserService();

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  const user = await userService.getUserById(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const perPage = parseInt(req.query.perPage as string, 10) || 10;

  const users = await userService.getAllUsers(page, perPage);
  res.json(users);
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  const updatedDetails = req.body;
  const updatedUser = await userService.updateUser(userId, updatedDetails);
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  await userService.deleteUser(userId);
  res.status(204).send({ message: "Account Deleted" });
};
