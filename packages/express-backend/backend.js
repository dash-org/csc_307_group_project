// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  userServices
    .getUsers(req.query.name, req.query.job)
    .then((users) => {
      return res.send({ users_list: users });
    })
    .catch((error) => console.log(error));
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userServices
    .findUserById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Resource not found.");
    });
});

app.post("/users", (req, res) => {
  let userToAdd = req.body;
  userServices
    .addUser(userToAdd)
    .then((user) => {
      userToAdd = user;
      res.status(201).send(userToAdd);
    })
    .catch((error) => console.log(error));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices
    .deleteUserById(id)
    .then((user) => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
