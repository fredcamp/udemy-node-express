const CustomError = require('../errors')
const { isTokenValid, attachCookiesToResponse } = require('../utils')
const Token = require('../models/Token')

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      console.log('accessToken: ', payload)

      req.user = payload.user
      return next()
    }

    const payload = isTokenValid(refreshToken)
    console.log('refreshToken:', payload)

    const existingToken = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userId,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })

    req.user = payload.user
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      )
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
