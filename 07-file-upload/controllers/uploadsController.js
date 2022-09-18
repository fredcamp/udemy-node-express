const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadProductImgLocal = async (req, res) => {
  if (!req.files) throw new CustomError.BadRequestError("Please provide file");

  const imageFile = req.files.image;

  if (!imageFile.mimetype.startsWith("image"))
    throw new CustomError.BadRequestError("Please provide image");

  if (imageFile.size > Number(process.env.IMG_MAX_SIZE))
    throw new CustomError.BadRequestError("Image should not exceed 2MB");

  const imagePath = path.resolve(
    __dirname,
    "../public/uploads/" + `${imageFile.name}`
  );

  await imageFile.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${imageFile.name}` } });
};

const uploadProductImg = async (req, res) => {
  const product = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);

  res.status(StatusCodes.OK).json({ image: { src: product.secure_url } });
};

module.exports = uploadProductImg;
