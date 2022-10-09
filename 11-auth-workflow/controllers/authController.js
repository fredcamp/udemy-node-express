const User = require('../models/User')
const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require('../utils')
const crypto = require('crypto')
const origin = 'http://localhost:3000'

const register = async (req, res) => {
  const { email, name, password } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  })

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  })
}
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify email')
  }

  const tokenUser = createTokenUser(user)

  // create refresh token
  let refreshToken = ''

  const existingToken = await Token.findOne({ user: user._id })
  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid)
      throw new CustomError.UnauthenticatedError('Invalid Credentials')

    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })

    return res.status(StatusCodes.OK).json({ user: tokenUser })
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const ip = req.ip
  const userAgent = req.headers['user-agent']

  const userToken = { refreshToken, ip, userAgent, user: user._id }
  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId })

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new CustomError.UnauthenticatedError('Verification Failed')

  const isVerificationTokenMatch = verificationToken === user.verificationToken
  if (!isVerificationTokenMatch)
    throw new CustomError.UnauthenticatedError('Verification Failed')

  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''
  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Email sucessfully verified' })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email)
    throw new CustomError.BadRequestError('Please provide valid email')

  const user = await User.findOne({ email })

  if (user) {
    const passwordToken = crypto.randomBytes(30).toString('hex')

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpiration = new Date(Date.now() + tenMinutes)

    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpiration = passwordTokenExpiration
    await user.save()
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' })
}

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body

  if (!token || !email || !password)
    throw new CustomError.BadRequestError('Please provide values')

  const user = await User.findOne({ email })

  if (user) {
    const currentDate = new Date()

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpiration > currentDate
    ) {
      user.password = password
      user.passwordToken = ''
      user.passwordTokenExpiration = null
      await user.save()
    }
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Password successfuly changed. Redirecting to Homepage' })
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}