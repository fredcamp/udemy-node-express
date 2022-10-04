const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
// const fs = require('fs')

const createProduct = async (req, res) => {
  req.body.user = req.user.userId

  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ count: products.length, products })
}

const getSingleProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id).populate('reviews')

  if (!product) throw new CustomError.NotFoundError(`No product with id ${id}`)
  res.status(StatusCodes.OK).json({ comments: product.reviews.length, product })
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) throw new CustomError.NotFoundError(`No product with id ${id}`)
  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  if (!product) throw new CustomError.NotFoundError(`No product with id ${id}`)

  await product.delete()
  res.status(StatusCodes.OK).json({ msg: 'product removed' })
}

const uploadImage = async (req, res) => {
  if (!req.files) throw new CustomError.BadRequestError('No file uploaded')

  const imageFile = req.files.image
  if (!imageFile.mimetype.startsWith('image'))
    throw new CustomError.BadRequestError('Please upload image')

  const maxSize = 1024 * 1024
  if (imageFile.size > maxSize)
    throw new CustomError.BadRequestError('Please upload file below 1MB')

  const imagePath = path.resolve(
    __dirname,
    '../public/uploads',
    `${imageFile.name}`
  )

  await imageFile.mv(imagePath)
  // fs.unlinkSync(req.files.image.tempFilePath)

  res.status(StatusCodes.OK).json({ image: `/uploads/${imageFile.name}` })
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}
