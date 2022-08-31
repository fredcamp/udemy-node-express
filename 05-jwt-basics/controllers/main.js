const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    throw new BadRequestError("Please provide username/password");

  const id = new Date().getDate();
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(StatusCodes.CREATED).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const { username } = req.user;
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(StatusCodes.OK).json({
    msg: `Hello, ${username}`,
    secret: `Here is your lucky number: ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
