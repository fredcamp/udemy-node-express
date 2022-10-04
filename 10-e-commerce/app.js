require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

// middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// routers
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')

// middlewares
app.set('trust proxy', 1)

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.static('./public'))
app.use(express.json())
// app.use(fileUpload({ useTempFiles: true }))
app.use(fileUpload())
app.use(cookieParser(process.env.JWT_SECRET))

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const connectDB = require('./db/connect')
const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    // await connectDB(process.env.MONGO_LOCAL)
    app.listen(port, console.log(`Listening on port ${port}....`))
  } catch (error) {
    console.log(error)
  }
}

start()
