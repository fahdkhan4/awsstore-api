import { AuthDocument, AuthModel } from "../model/auth.model";
import bcrypt from "bcryptjs";

export class AuthService {
  async register(user: AuthDocument): Promise<AuthDocument> {
    user.password = await bcrypt.hash(user.password, 10);
    return AuthModel.create(user);
  }

  async login(email: string, password: string): Promise<AuthDocument | null> {
    const user = await AuthModel.findOne({ email });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  async updateUser(
    username: string,
    updates: Partial<AuthDocument>
  ): Promise<AuthDocument | null> {
    const user = await AuthModel.findOneByUsername(username);

    if (!user) return null;

    // Update user fields
    if (updates.password)
      updates.password = await bcrypt.hash(updates.password, 10);

    Object.assign(user, updates);

    // Save the updated user
    return user.save();
  }

  async deleteUserByUserName(username: string): Promise<boolean> {
    // Find the user by username and delete
    const result = await AuthModel.deleteOne({ username });

    return result.deletedCount === 1;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await AuthModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
