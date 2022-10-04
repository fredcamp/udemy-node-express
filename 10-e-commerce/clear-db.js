require('dotenv').config()

const User = require('./models/User')
const Product = require('./models/Product')
const Review = require('./models/Review')

const connectDB = require('./db/connect')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    // await User.deleteMany()
    await Product.deleteMany()
    await Review.deleteMany()
    console.log('Successfully cleared database.')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
