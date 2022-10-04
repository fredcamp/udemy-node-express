const CustomError = require('../errors')
const { jwt } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token

  if (!token)
    throw new CustomError.UnauthenticatedError('Not allowed to access')

  try {
    const payload = jwt.verifyJWT(token)
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    }
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Not allowed to access')
  }
}

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new CustomError.ForbiddenError('Not allowed to access this route')
    next()
  }
}

module.exports = { authenticateUser, authorizePermission }
