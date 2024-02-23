import mongoose, { Model, Document } from "mongoose";
import { generateRandomString } from "../../helpers/generateRandomString";
export interface AuthDocument extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  fullName: string;
  role: "admin" | "user";
  accountType: "seller" | "user";
  accountBalance: number; // for seller
  paidBooks: string[]; // for user
  booksBought: string[]; // for seller
  createdAt: Date;
  updatedAt: Date;
}

interface AuthModel extends Model<AuthDocument> {
  findOneByUsername(username: string): Promise<AuthDocument | null>;
}

const authSchema = new mongoose.Schema<AuthDocument>({
  email: { required: true, type: String, index: true, unique: true },
  fullName: { required: true, type: String, index: true },
  password: { type: String, required: true },
  username: {
    type: String,
    unique: true,
    validate: {
      validator: async function (value: string) {
        const context: any = this;
        const isUsernameModified =
          context.isNew || context.isModified("username");
        if (isUsernameModified) {
          const existingUser = await (
            this.constructor as AuthModel
          ).findOneByUsername(value);
          if (existingUser) {
            const randomString = generateRandomString(2);
            const suggestedUsername = `${value}_${randomString}`;
            throw new Error(
              `Username ${value} is already taken. Suggested: ${suggestedUsername}`
            );
          }
        }
        return true;
      },
      message: "Username validation failed",
    },
  },
  role: { type: String, required: true, enum: ["admin", "user"] },
  accountType: { type: String, required: true, enum: ["seller", "user"] },
  accountBalance: { type: Number, default: 0 },
  paidBooks: { type: [String], default: [] },
  booksBought: { type: [String], default: [] },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

authSchema.statics.findOneByUsername = function (
  username: string
): Promise<AuthDocument | null> {
  return this.findOne({ username }).exec();
};

export const AuthModel = mongoose.model<AuthDocument, AuthModel>(
  "Auth",
  authSchema
);
