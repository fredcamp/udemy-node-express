let { people } = require("../data");
let peopleLength = people.length;

const getPeople = (req, res) => {
  res.status(200).json({ success: true, data: people });
};

const createPerson = (req, res) => {
  const { name } = req.body;
  people.push({ id: ++peopleLength, name: name });

  res.status(201).send("successfully added!");
};

const getPerson = (req, res) => {
  const { id } = req.params;
  const findPerson = people.find((person) => person.id === Number(id));

  res.json(findPerson);
};

const deletePerson = (req, res) => {
  const { id } = req.params;

  const findPerson = people.find((person) => person.id === Number(id));

  if (!findPerson)
    return res.status(404).json({ success: false, message: "id doesnt exist" });

  people = people.filter((person) => person.id !== Number(id));
  res.status(200).json({ success: true, message: people });
};

const updatePerson = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const findPerson = people.find((person) => person.id === Number(id));

  if (!findPerson)
    return res.status(404).json({ success: false, message: "id doesnt exist" });

  people = people.map((person) => {
    if (person.id === Number(id)) {
      person.name = name;
    }
    return person;
  });
  res.status(200).json({ success: true, message: `${name} has been added.` });
};

module.exports = {
  getPeople,
  createPerson,
  getPerson,
  deletePerson,
  updatePerson,
};
