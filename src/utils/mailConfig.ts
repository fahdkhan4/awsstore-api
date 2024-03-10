import { TransportOptions } from "../emails/mailTypes";
import dotenv from "dotenv";

dotenv.config();

const mailConfig: TransportOptions = {
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
};

export default mailConfig;
