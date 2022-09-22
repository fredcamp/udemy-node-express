const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { StatusCodes } = require('http-status-codes')

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body

  const calculateOrderAmount = () => {
    return Number(total_amount + shipping_fee)
  }

  const payment = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'usd',
  })

  res.status(StatusCodes.OK).json({ clientSecret: payment.client_secret })
}

module.exports = stripeController
