import { createTransport } from "nodemailer";
import {google} from "googleapis"
import { configObj } from "../config.js"
import dotenv from "dotenv";

const OAuth2 = google.auth.OAuth2
dotenv.config();

const OAuth2_client = new OAuth2(configObj.clientId, configObj.clientSecret)
OAuth2_client.setCredentials({refresh_token: configObj.refreshToken})

// set up the email transporter
const setupTransporter = () => {
  const accessToken = OAuth2_client.getAccessToken()
  return createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: configObj.user,
      clientId: configObj.clientId,
      clientSecret: configObj.clientSecret,
      refreshToken: configObj.refreshToken,
      accessToken: accessToken,
    },
  });
};

// send an email
const sendEmail = async (options) => {
  try {
    const transporter = setupTransporter();

    // Send the email
    await transporter.sendMail(options);

    console.log("Email sent successfully.");
  } catch (error) {
    console.log("Error sending email:", error);
    throw error; // Re-throw the error to be handled by the calling function if needed
  }
};

// send the notification email
const sendNotificationEmail = async (userEmail) => {
  const options = {
    from: process.env.USER,
    to: "nyawayanathan@gmail.com",
    subject: "New User About To confirm",
    text: `User with email ${userEmail} are in the registering process.`,
  };

  await sendEmail(options);
};

// successfull confirmed
const successfullRegistered = async (userEmail) => {
  const options = {
    from: process.env.USER,
    to: "nyawayanathan@gmail.com",
    subject: "New User Successfully Registered",
    text: `User with email ${userEmail} SUCCESSFULLY registered. #GROWING`,
  };

  await sendEmail(options);
};

// send the verification email
const verifyEmail = async (email, code) => {
  const options = {
    from: process.env.USER,
    to: email,
    subject: "SmartBet account Email Verification",
    html: `
    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
      <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 20px; background-color: green; padding: 10px; color: white; text-align: center;">Thank you for registering with SmartBet</h1>
      <p>
        Your confirmation code is: <span style="color: #007bff; font-weight: bold;">${code}</span>
      </p>
     
      </body>
    `,
  };

  await sendEmail(options);

  // Send notification email after the user's email is successfully sent
  await sendNotificationEmail(email);
};

export { verifyEmail, successfullRegistered };