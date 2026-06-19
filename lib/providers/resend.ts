import { Resend } from 'resend';

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Content System <noreply@yourdomain.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) throw new Error(error.message);
  return data;
}
