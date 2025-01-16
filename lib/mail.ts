import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = "Your two-factor authentication code";
  sendSmtpEmail.htmlContent = `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`;

  sendSmtpEmail.to = [
    {
      email: email,
    },
  ];

  sendSmtpEmail.sender = {
    name: "Learn2PNL",
    email: "learn2pnl@gmail.com",
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const sendSmtpEmail = new SendSmtpEmail();
  const resetLink = `${NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;

  sendSmtpEmail.subject = "Reset your password";
  sendSmtpEmail.htmlContent = `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`;

  sendSmtpEmail.to = [
    {
      email: email,
    },
  ];

  sendSmtpEmail.sender = {
    name: "Learn2PNL",
    email: "learn2pnl@gmail.com",
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const sendSmtpEmail = new SendSmtpEmail();
  const confirmLink = `${NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

  sendSmtpEmail.subject = "Confirm your email";
  sendSmtpEmail.htmlContent = `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`;

  sendSmtpEmail.to = [
    {
      email: email,
    },
  ];

  sendSmtpEmail.sender = {
    name: "Learn2PNL",
    email: "learn2pnl@gmail.com",
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};
