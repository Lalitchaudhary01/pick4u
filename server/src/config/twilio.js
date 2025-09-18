import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your Pick4U verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return message;
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};
