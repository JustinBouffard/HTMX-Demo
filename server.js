import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Handle GET request to /users endpoint
app.get("/users", async (req, res) => {
  const limit = +req.query.limit || 10;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=${limit}`,
  );
  const users = await response.json();

  res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join("")}
    </ul>
  `);
});

// Hanldle POST request for temp conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);

    res.send(`
        <p>${fahrenheit}°F is equal to ${celsius}°C</p>
    `);
  }, 2000);
});

let counter = 0;

// Handle GET request to the /poll endpoint
app.get("/poll", (req, res) => {
  counter++;

  let result = "";

  for (let i = 0; i < counter; i++) {
    result += `<li>Poll count: ${i + 1}</li>`;
  }

  res.send(result);
});

let currentTemperature = 20;

// Handle GET request for weather
app.get("/get-temperature", (req, res) => {
  currentTemperature += Math.random() * 2 - 1; // Randomly change temperature by -1 to +1
  res.send(currentTemperature.toFixed(2) + "°C");
});

const contacts = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" },
  { name: "David", email: "david@example.com" },
  { name: "Eve", email: "eve@example.com" },
];

// Handle POST request for contact search
app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultsHtml = searchResults
      .map(
        (contact) => `
        <tr>
            <td><div class="my-4 p-2">${contact.name}</div></td>
            <td><div class="my-4 p-2">${contact.email}</div></td>
        </tr>`,
      )
      .join("");
    res.send(searchResultsHtml);
  }, 1000);
});

// Handle POST request for contact search from jsonplaceholder
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultsHtml = searchResults
      .map(
        (contact) => `
        <tr>
            <td><div class="my-4 p-2">${contact.name}</div></td>
            <td><div class="my-4 p-2">${contact.email}</div></td>
        </tr>`,
      )
      .join("");
    res.send(searchResultsHtml);
  }, 1000);
});

// Handle POST request for email validation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: "That email is valid",
    class: "text-green-700",
  };

  const isInvalid = {
    message: "That email is invalid",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
          >Email Address</label
        >
        <input
          name="email"
          hx-post="/contact/email"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          type="email"
          id="email"
          value="${submittedEmail}"
          required
        />
        <div class="${isInvalid.class} ml-2">${isInvalid.message}</div>
      </div>
      `,
    );
  } else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
          >Email Address</label
        >
        <input
          name="email"
          hx-post="/contact/email"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          type="email"
          id="email"
          value="${submittedEmail}"
          required
        />
        <div class="${isValid.class} ml-2">${isValid.message}</div>
      </div>
      `,
    );
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
