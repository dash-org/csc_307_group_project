// backend.js
import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import mongoose from 'mongoose';
import connectionString from './secret.js';
import memberServices from './services/member-services.js';
import inventoryServices from './services/inventory-services.js';
import itemServices from './services/item-services.js';
import { registerUser, authenticateUser, loginUser } from './auth.js';

mongoose.set('debug', true);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post('/signup', registerUser);

app.post('/login', loginUser);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', authenticateUser, (req, res) => {
  userServices
    .getUsers(req.query.name, req.query.createdAt)
    .then((users) => {
      return res.send({ users_list: users });
    })
    .catch((error) => console.log(error));
});

app.get('/memberships', authenticateUser, (req, res) => {
  memberServices
    .getMembers(
      req.query.userId,
      req.query.role,
      req.query.permissions,
      req.query.addedAt
    )
    .then((members) => {
      return res.send({ members_list: members });
    })
    .catch((error) => console.log(error));
});

app.get('/inventories', authenticateUser, (req, res) => {
  inventoryServices
    .getInventory(
      req.query.name,
      req.query.createdBy,
      req.query.createdAt,
      req.query.items
    )
    .then((inventories) => {
      return res.send({ inventory_list: inventories });
    })
    .catch((error) => console.log(error));
});

app.get('/items', authenticateUser, (req, res) => {
  itemServices
    .getItems(
      req.query.name,
      req.query.quantity,
      req.query.description,
      req.query.tags,
      req.query.createdAt,
      req.query.createdBy
    )
    .then((items) => {
      return res.send({ item_list: items });
    })
    .cath((error) => console.log(error));
});

app.get('/users/:id', authenticateUser, (req, res) => {
  const id = req.params['id']; //or req.params.id
  userServices
    .findUserById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send('Resource not found.');
    });
});

app.get('/items/:id', authenticateUser, (req, res) => {
  const id = req.params['id']; //or req.params.id
  itemServices
    .findItemById(id)
    .then((item) => {
      res.send(item);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send('Resource not found.');
    });
});

app.get('/memberships/:id', authenticateUser, (req, res) => {
  const id = req.params['id']; //or req.params.id
  memberServices
    .findMemberById(id)
    .then((member) => {
      res.send(member);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send('Resource not found.');
    });
});

app.get('/inventories/:id', authenticateUser, (req, res) => {
  const id = req.params['id']; //or req.params.id
  inventoryServices
    .findInventoryById(id)
    .then((inventory) => {
      res.send(inventory);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send('Resource not found.');
    });
});

app.post('/users', authenticateUser, (req, res) => {
  let userToAdd = req.body;

  userServices
    .addUser(userToAdd)
    .then((user) => {
      userToAdd = user;

      res.status(201).send(userToAdd);
    })
    .catch((error) => console.log(error));
});

app.post('/items', authenticateUser, (req, res) => {
  let itemToAdd = req.body;
  itemServices
    .addItem(itemToAdd)
    .then((item) => {
      itemToAdd = item;
      res.status(201).send(itemToAdd);
    })
    .catch((error) => console.log(error));
});

app.post('/memberships', authenticateUser, (req, res) => {
  let memberToAdd = req.body;
  memberServices
    .addItem(memberToAdd)
    .then((item) => {
      memberToAdd = item;
      res.status(201).send(memberToAdd);
    })
    .catch((error) => console.log(error));
});

app.post('/inventories', authenticateUser, (req, res) => {
  let inventoryToAdd = req.body;
  inventoryServices
    .addItem(inventoryToAdd)
    .then((inventory) => {
      inventoryToAdd = inventory;
      res.status(201).send(inventoryToAdd);
    })
    .catch((error) => console.log(error));
});

app.delete('/users/:id', authenticateUser, (req, res) => {
  const id = req.params['id'];
  userServices
    .deleteUserById(id)
    .then((user) => {
      console.log(`Deleted user ${user._id}`);
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

app.delete('/items/:id', authenticateUser, (req, res) => {
  const id = req.params['id'];
  itemServices
    .deleteItemById(id)
    .then((item) => {
      console.log(`Deleted item ${item._id}`);
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

app.delete('/memberships/:id', authenticateUser, (req, res) => {
  const id = req.params['id'];
  memberServices
    .deleteMemberById(id)
    .then((member) => {
      console.log(`Deleted membership ${member._id}`);
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send();
    });
});

app.delete('/inventories/:id', authenticateUser, (req, res) => {
  const id = req.params['id'];
  inventoryServices
    .deleteInventoryById(id)
    .then((inventory) => {
      console.log(`Deleted inventory ${inventory.id}`);
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
