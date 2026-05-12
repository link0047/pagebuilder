import { Resend } from "resend";
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

export const sendResetEmail = async (email: string, url: string, name: string) => {
  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px;">
        <h2 style="color: #111827; margin-bottom: 24px;">Reset your password</h2>
        <p style="color: #374151; line-height: 1.5; margin-bottom: 24px;">
          Hello ${name || "there"},<br><br>
          We received a request to reset the password for your account in <strong>Page Builder</strong>.
          If you didn't make this request, you can safely ignore this email.
        </p>
        <div style="margin-bottom: 32px;">
          <a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
          The link above will expire in 1 hour.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">
          If the button doesn't work, copy and paste this URL into your browser: <br>
          <span style="word-break: break-all; color: #2563eb;">${url}</span>
        </p>
      </div>
    `
  });
};
