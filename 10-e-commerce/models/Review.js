const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: 50,
      required: [true, 'Please provide title'],
    },
    comment: {
      type: String,
      maxlength: 300,
      required: [true, 'Please provide comment'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide product'],
    },
  },
  { timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        numOfReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ])

  await this.model('Product').findOneAndUpdate(
    { product: productId },
    {
      averageRating: Math.round(result[0]?.averageRating) || 0,
      numOfReviews: result[0]?.numOfReviews || 0,
    }
  )
}

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)
