const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createUserToken, jwt, checkPermission } = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ count: users.length, users })
}

const getSingleUser = async (req, res) => {
  const { id: _id } = req.params
  const user = await User.findOne({ _id }).select('-password')

  if (!user) throw new CustomError.NotFoundError('User does not exist')

  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body
  if (!name || !email)
    throw new CustomError.BadRequestError(
      'Name and Email fields cannot be empty'
    )

  // update user by using findByIdAndUpdate
  // const user = await User.findByIdAndUpdate(
  //   req.user.userId,
  //   { name, email },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // )

  // update user by using user.save()
  const user = await User.findById(req.user.userId)
  user.name = name
  user.email = email
  await user.save()

  const userToken = createUserToken(user)
  jwt.attachCookiestoResponse(res, userToken)

  res.status(StatusCodes.OK).json({ user: userToken })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const { userId: _id, name } = req.user

  if (!oldPassword || !newPassword)
    throw new CustomError.BadRequestError(
      'Please provide old and new passwords'
    )

  const user = await User.findById(_id)
  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect)
    throw new CustomError.UnauthenticatedError('Invalid credentials')

  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: `${name} password updated!` })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
