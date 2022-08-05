const express = require("express");
const router = express.Router();
const {
  getPeople,
  createPerson,
  getPerson,
  deletePerson,
  updatePerson,
} = require("../controller/people");

router.route("/").get(getPeople).post(createPerson);
router.route("/:id").get(getPerson).delete(deletePerson).put(updatePerson);

module.exports = router;
