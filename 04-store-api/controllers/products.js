const Product = require("../models/product");

const getProductsStatic = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ nbHits: products.length, products });
};

const getProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  let objectQuery = {};

  if (featured) objectQuery.featured = featured === "true" ? true : false;
  if (company) objectQuery.company = company;
  if (name) objectQuery.name = { $regex: name, $options: "i" };

  //   numericFilters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const options = ["price", "rating"];
    const regEx = /\b(>|>=|=|<|<=)\b/g;

    const filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    filters.split(",").forEach((item) => {
      const [key, operator, value] = item.split("-");

      if (options.includes(key))
        objectQuery[key] = { [operator]: Number(value) };
    });
  }

  let result = Product.find(objectQuery);

  //   sort
  if (sort) {
    result = result.sort(sort.split(",").join(" "));
  } else {
    result = result.sort("createdAt");
  }

  // fields
  if (fields) result = result.select(fields.split(",").join(" "));

  //   page
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getProductsStatic, getProducts };
