import nodemailer from "nodemailer";
import mailConfig from "../../utils/mailConfig";
import { TransportCategoryCreation } from "../mailTypes";

export const sendCategoryCreationState = async (
  userData: TransportCategoryCreation
) => {
  const transporter = nodemailer.createTransport(mailConfig);

  const mailOptions = {
    from: "Reader App <no-reply@readerapp.com>",
    to: "frimpong@awstore.info",
    subject: `Added New ${userData.categoryTitle}`,
    text: `${userData.categoryTitle}} has been created successfully. It is now in ${userData.state} state. Please check the app for more details.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
