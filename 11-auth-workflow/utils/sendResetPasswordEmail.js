const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetPassword = `${origin}/user/reset-password?token=${token}&email=${email}`
  const message = `<p>To reset your password, please click the link: <a href="${resetPassword}">Reset Password</a></p>`

  return sendEmail({
    to: email,
    subject: 'Password Reset',
    html: `<h4>Hello ${name}</h4>
    ${message}`,
  })
}

module.exports = sendResetPasswordEmail
