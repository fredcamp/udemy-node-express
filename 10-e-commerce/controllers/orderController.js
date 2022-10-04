const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { checkPermission } = require('../utils')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'sampleClientSecret'

  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body

  if (!cartItems || cartItems.length < 1)
    throw new CustomError.BadRequestError('Please add items to cart')

  if (!tax || !shippingFee)
    throw new CustomError.BadRequestError('Please provide tax and shipping fee')

  let subtotal = 0
  let orderItems = []

  for (const cartItem of cartItems) {
    const item = await Product.findOne({ _id: cartItem.product })

    if (!item)
      throw new CustomError.NotFoundError(
        `No product with id: ${cartItem.product}`
      )

    const { name, price, image, _id } = item

    orderItems.push({
      name,
      price,
      image,
      product: _id,
      amount: cartItem.amount,
    })
    subtotal += price * cartItem.amount
  }
  const total = tax + shippingFee + subtotal

  const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'usd' })

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})

  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id

  const order = await Order.findById(orderId)
  if (!order)
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)

  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })

  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

const updateOrder = async (req, res) => {
  const orderId = req.params.id
  const { paymentIntentId } = req.body

  if (!paymentIntentId)
    throw new CustomError.BadRequestError('Please provide payment intent ID')

  const order = await Order.findById(orderId)
  if (!order)
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`)

  checkPermission(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
