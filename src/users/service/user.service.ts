import { AuthDocument, AuthModel } from "../../auth/model/auth.model";

export class UserService {
  async getUserById(userId: string): Promise<AuthDocument | null> {
    try {
      return await AuthModel.findById(userId).exec();
    } catch (error: any) {
      throw new Error(`Failed to get user by ID: ${error.message}`);
    }
  }

  async getAllUsers(
    page: number = 1,
    perPage: number = 10
  ): Promise<AuthDocument[]> {
    try {
      const users = await AuthModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
      return users;
    } catch (error: any) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async updateUser(
    userId: string,
    updatedDetails: Partial<AuthDocument>
  ): Promise<AuthDocument | null> {
    try {
      const user = await AuthModel.findByIdAndUpdate(
        userId,
        {
          ...updatedDetails,
          updatedAt: new Date(),
        },
        { new: true }
      ).exec();
      return user;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await AuthModel.findByIdAndDelete(userId).exec();
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async updateSellerAccountBalance(
    userId: string,
    amount: number
  ): Promise<void> {
    try {
      (await AuthModel.findByIdAndUpdate(userId, {
        $inc: { accountBal: amount },
      }).exec) &&
        (await AuthModel.updateOne(
          { _id: userId },
          { $inc: { accountBal: amount } }
        ).exec());
      let user = await this.getUserById(userId);
      if (user) {
        user.accountBalance = (user.accountBalance ?? 0) + amount;
        await user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (err: any) {
      throw new Error(
        `Failed to update seller account balance: ${err.message}`
      );
    }
  }

  async updateBuyerBooksBought(
    userId: string,
    bookIds: string[]
  ): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (user) {
        await AuthModel.updateOne(
          { _id: userId },
          { $addToSet: { booksBought: { $each: bookIds } } }
        );
      } else {
        throw new Error("User not found");
      }
    } catch (e: any) {
      throw new Error(`Failed to update buyer books bought: ${e.message}`);
    }
  }

  async updateSellerBooksSold(userId: string, bookId: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (user) {
        if (!user.paidBooks) {
          user.paidBooks = [];
        }
        user.paidBooks.push(bookId);
        await user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (e: any) {
      throw new Error(`Failed to update seller books sold: ${e.message}`);
    }
  }
}
