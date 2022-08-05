const peopleDiv = document.querySelector("#people");
const formDiv = document.querySelector("#add");
const putDiv = document.querySelector("#put");

showPeople();

formDiv.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.querySelector("#name").value.trim().length < 1) return;

  submitForm(e.target);
});

putDiv.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    e.target.querySelector("#id").value.trim().length < 1 ||
    e.target.querySelector("#name").value.trim().length < 1
  )
    return;

  putForm(e.target);
});

async function putForm(form) {
  const id = form.querySelector("#id").value;
  const name = form.querySelector("#name").value;

  const file = await fetch(`/api/people/${id}`, {
    method: "put",
    body: JSON.stringify({ name: name }),
    headers: {
      "content-type": "application/json",
    },
  });
  const fileJSON = await file.json();
  alert(fileJSON.message);
  showPeople();
  form.reset();
}

async function submitForm(form) {
  const formData = new FormData(form);
  let object = {};

  formData.forEach((value, key) => (object[key] = value));
  const formDataJSON = JSON.stringify(object);

  const file = await fetch("/api/people", {
    method: "post",
    body: formDataJSON,
    headers: {
      "content-type": "application/json",
    },
  });
  const fileTxt = await file.text();

  alert(fileTxt);
  showPeople();
  form.reset();
}

async function showPeople() {
  try {
    const { data } = await (await fetch("/api/people")).json();
    const result = data.map(
      (person) => person.name.charAt(0).toUpperCase() + person.name.slice(1)
    );
    peopleDiv.textContent = result.join(" ");
  } catch (error) {
    const span = document.createElement("span");
    span.style.color = "red";
    span.appendChild(document.createTextNode("cannot fetch data"));
    peopleDiv.appendChild(span);
  }
}
