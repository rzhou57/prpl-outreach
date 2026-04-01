const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"PRPL Robotics Outreach" <${process.env.SMTP_USER}>`;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(to, firstName, code) {
  console.log('Sending verification email to:', to, 'code:', code); // add this
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your PRPL Robotics account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f8f6;border-radius:12px;">
        <h2 style="font-family:monospace;color:#7c3aed;letter-spacing:0.08em;margin-bottom:8px;">PRPL Robotics Outreach</h2>
        <p style="color:#444;margin-bottom:24px;">Hi ${firstName}! Welcome to the program. Use this code to verify your email:</p>
        <div style="background:#7c3aed;color:white;font-size:2rem;font-family:monospace;letter-spacing:0.3em;text-align:center;padding:20px;border-radius:10px;margin-bottom:24px;">
          ${code}
        </div>
        <p style="color:#888;font-size:0.85rem;">This code expires in 10 minutes. If you didn't sign up, you can ignore this email.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(to, firstName, code) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Reset your PRPL Robotics password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f8f6;border-radius:12px;">
        <h2 style="font-family:monospace;color:#7c3aed;letter-spacing:0.08em;margin-bottom:8px;">PRPL Robotics Outreach</h2>
        <p style="color:#444;margin-bottom:24px;">Hi ${firstName}! Use this code to reset your password:</p>
        <div style="background:#7c3aed;color:white;font-size:2rem;font-family:monospace;letter-spacing:0.3em;text-align:center;padding:20px;border-radius:10px;margin-bottom:24px;">
          ${code}
        </div>
        <p style="color:#888;font-size:0.85rem;">This code expires in 10 minutes. If you didn't request a password reset, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { generateCode, sendVerificationEmail, sendPasswordResetEmail };