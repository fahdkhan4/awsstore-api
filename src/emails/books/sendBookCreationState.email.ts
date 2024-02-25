import nodemailer from "nodemailer";
import mailConfig from "../../utils/mailConfig";
import { TransportBookCreation } from "../mailTypes";
import { isValidEmail } from "../../helpers/validateEmail.helper";

export const sendBookCreationState = async (
  userData: TransportBookCreation
) => {
  const transporter = nodemailer.createTransport(mailConfig);

  if (!isValidEmail(userData.email)) throw new Error("Invalid email");

  const mailOptions = {
    from: "Reader App <no-reply@readerapp2018@gmail.com>",
    to: userData.email,
    subject: "Book Creation State",
    text: `The book ${userData.bookTitle} has been ${userData.state}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.log(error);
  }
};
