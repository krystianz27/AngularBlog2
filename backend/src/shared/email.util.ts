// import { Resend } from "resend";

// export async function sendConfirmationEmail(email: string, token: string) {
//   const html = `
//       <h1>Confirm your email</h1>
//       <p>Click <a href="${process.env.BACKEND_URL}/api/auth/confirm-email/${token}">here</a> to confirm your email</p>
//       `;

//   const resend = new Resend(process.env.RESEND_API_KEY);

//   return await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Please confirm your email",
//     html,
//   });
// }

// export function sendForgotPasswordEmail(email: string, token: string) {
//   const html = `
//         <h1>Reset your password</h1>
//         <p>Click <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
//         `;

//   const resend = new Resend(process.env.RESEND_API_KEY);

//   return resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Reset your password",
//     html,
//   });
// }

// import { google } from "googleapis";

// const gmail = google.gmail("v1");

// // Funkcja do wysyłania potwierdzenia e-mail
// export async function sendConfirmationEmail(email: string, token: string) {
//   const subject = "Please confirm your email";
//   const html = `
//       <h1>Confirm your email</h1>
//       <p>Click <a href="${process.env.BACKEND_URL}/api/auth/confirm-email/${token}">here</a> to confirm your email</p>
//       `;

//   const message = createEmailMessage(email, subject, html);
//   await sendEmail(message);
// }

// // Funkcja do wysyłania e-maila resetowania hasła
// export async function sendForgotPasswordEmail(email: string, token: string) {
//   const subject = "Reset your password";
//   const html = `
//         <h1>Reset your password</h1>
//         <p>Click <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
//         `;

//   const message = createEmailMessage(email, subject, html);
//   await sendEmail(message);
// }

// // Funkcja do tworzenia wiadomości e-mail
// function createEmailMessage(to: string, subject: string, html: string) {
//   const boundary = "boundary-string";
//   return [
//     `From: "Krystian" <krystiaann27@gmail.com>`,
//     `To: ${to}`,
//     `Subject: ${subject}`,
//     `Content-Type: text/html; charset="UTF-8"`,
//     `MIME-Version: 1.0`,
//     ``,
//     `--${boundary}`,
//     `Content-Type: text/html; charset="UTF-8"`,
//     ``,
//     html,
//     ``,
//     `--${boundary}--`,
//   ].join("\n");
// }

// // Funkcja do wysyłania e-maili za pomocą Gmail API
// async function sendEmail(message: string) {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URL
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//   });

//   const accessToken = await oauth2Client.getAccessToken();
//   oauth2Client.setCredentials({ access_token: accessToken.token });

//   const res = await gmail.users.messages.send({
//     auth: oauth2Client,
//     userId: "me",
//     requestBody: {
//       raw: Buffer.from(message).toString("base64").replace(/=+$/, ""),
//     },
//   });

//   return res.data;
// }

//  GOOGLE API
import { google } from "googleapis";
import { ensureAccessToken } from "./gmailAuth";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function sendEmail(to: string, subject: string, html: string) {
  await ensureAccessToken();
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const encodedMessage = Buffer.from(
    `From: "Krystian" <krystiaann27@gmail.com>\n` +
      `To: ${to}\n` +
      `Subject: ${subject}\n` +
      `Content-Type: text/html; charset="UTF-8"\n\n${html}`
  )
    .toString("base64")
    .replace(/=/g, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

export async function sendConfirmationEmail(email: string, token: string) {
  const html = `
      <h1>Confirm your email</h1>
      <p>Click <a href="${process.env.BACKEND_URL}/api/auth/confirm-email/${token}">here</a> to confirm your email</p>
      `;
  const subject = "Please confirm your email";

  return await sendEmail(email, subject, html);
}

export async function sendForgotPasswordEmail(email: string, token: string) {
  const html = `
      <h1>Reset your password</h1>
      <p>Click <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
      `;
  const subject = "Reset your password";

  return await sendEmail(email, subject, html);
}

// import { google } from "googleapis";

// const gmail = google.gmail("v1");

// // Funkcja do wysyłania potwierdzenia e-mail
// export async function sendConfirmationEmail(email: string, token: string) {
//   const subject = "Please confirm your email";
//   const html = `
//       <h1>Confirm your email</h1>
//       <p>Click <a href="${process.env.BACKEND_URL}/api/auth/confirm-email/${token}">here</a> to confirm your email</p>
//       `;

//   const message = createEmailMessage(email, subject, html);
//   await sendEmail(message);
// }

// // Funkcja do wysyłania e-maila resetowania hasła
// export async function sendForgotPasswordEmail(email: string, token: string) {
//   const subject = "Reset your password";
//   const html = `
//         <h1>Reset your password</h1>
//         <p>Click <a href="${process.env.FRONTEND_URL}/auth/reset-password?token=${token}">here</a> to reset your password</p>
//         `;

//   const message = createEmailMessage(email, subject, html);
//   await sendEmail(message);
// }

// // Funkcja do tworzenia wiadomości e-mail
// function createEmailMessage(to: string, subject: string, html: string) {
//   const boundary = "boundary-string";
//   return [
//     `From: "Krystian" <krystiaann27@gmail.com>`,
//     `To: ${to}`,
//     `Subject: ${subject}`,
//     `Content-Type: text/html; charset="UTF-8"`,
//     `MIME-Version: 1.0`,
//     ``,
//     `--${boundary}`,
//     `Content-Type: text/html; charset="UTF-8"`,
//     ``,
//     html,
//     ``,
//     `--${boundary}--`,
//   ].join("\n");
// }

// // Funkcja do wysyłania e-maili za pomocą Gmail API
// async function sendEmail(message: string) {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URL
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//   });

//   const accessToken = await oauth2Client.getAccessToken();
//   oauth2Client.setCredentials({ access_token: accessToken.token });

//   const res = await gmail.users.messages.send({
//     auth: oauth2Client,
//     userId: "me",
//     requestBody: {
//       raw: Buffer.from(message).toString("base64").replace(/=+$/, ""),
//     },
//   });

//   return res.data;
// }
