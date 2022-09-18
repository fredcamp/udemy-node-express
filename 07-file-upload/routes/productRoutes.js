const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
} = require("../controllers/productController");
const uploadProductImg = require("../controllers/uploadsController");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/uploads").post(uploadProductImg);

module.exports = router;
