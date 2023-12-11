import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'keerthurb9@gmail.com',
    pass: 'czhinoimlmzdxaxi'
  }
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: 'keerthurb9@gmail.com',
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const forgotPassword = async ({ name, email, url }) => {
  try {
    const to = email;
    const subject = 'Reset Password Request';
    const html = `
      <p>Dear ${name},</p>
      <p>We have received your request to reset the password. If you really want to reset it kindly click the button below.</p>
          <p>Reset Password</p>
      <p>If the above button does not work kindly click the URL. <a href="${url}">${url}</a></p>`;

    await sendMail({ to, subject, text: '', html });
  } catch (error) {
    return error;
  }
};

export default { forgotPassword, sendMail };
