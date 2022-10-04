const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermission } = require('../utils')

const createReview = async (req, res) => {
  const { product: productId } = req.body
  req.body.user = req.user.userId

  const isProductValid = await Product.findById(productId)
  if (!isProductValid)
    throw new CustomError.NotFoundError(`No product with id: ${productId}`)

  const isReviewAlreadyExist = await Review.findOne({
    user: req.user.userId,
    product: productId,
  })
  if (isReviewAlreadyExist)
    throw new CustomError.BadRequestError(
      'Already submitted a review for this product'
    )

  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

const getReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findById(reviewId)

  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findById(reviewId)
  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)

  checkPermission(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()

  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findById(reviewId)
  if (!review)
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`)

  checkPermission(req.user, review.user)
  await review.delete()

  res.status(StatusCodes.OK).json({ msg: 'Review deleted' })
}

const getProductReviews = async (req, res) => {
  const { id: productId } = req.params

  const reviews = await Review.find({ product: productId })
    .populate({
      path: 'user',
      select: 'name',
    })
    .sort('-createdAt')
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  getProductReviews,
}
