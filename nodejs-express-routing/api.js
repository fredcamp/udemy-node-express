const express = require("express");

const app = express();
const { products } = require("./data");

app.get("/", (req, res) => {
  res.send('<h1>Homepage</h1><a href="/api/products">products</a>');
});

app.get("/api/products", (req, res) => {
  const newProducts = products.map((product) => {
    const { id, name, image, price } = product;
    return { id, name, image, price };
  });

  res.json(newProducts);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const findProduct = products.find((product) => product.id === Number(id));

  if (!findProduct) return res.status(404).send("product not found");
  res.json(findProduct);
});

app.get("/api/products/:productID/reviews/:reviewID", (req, res) => {
  console.log(req.params);
  res.send("hello world");
});

app.get("/api/v1/search", (req, res) => {
  const { name, limit } = req.query;
  let sortedProducts = [...products];

  if (name) {
    sortedProducts = sortedProducts.filter((product) =>
      product.name.startsWith(name)
    );
  }

  if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
  }

  res.json(sortedProducts);
});

app.listen(5000, () => console.log("listening to port 5000"));
