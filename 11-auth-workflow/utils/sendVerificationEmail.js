const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  const message = `<p>To verify your account, please click the link: <a href="${verifyEmail}" target="_blank">Verify Email</a></p>`

  return sendEmail({
    to: email,
    subject: 'Email Verification',
    html: `<h4>Hello ${name},</h4>
    ${message}
    `,
  })
}

module.exports = sendVerificationEmail
