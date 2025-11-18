// backend.js
import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import memberServices from './services/member-services.js';
import inventoryServices from './services/inventory-services.js';
// import itemServices from './services/item-services.js';
import kitchenServices from './services/kitchen-services.js';
import { registerUser, authenticateUser, loginUser } from './auth.js';

mongoose.set('debug', true);

dotenv.config();
const connectionString = process.env.MONGODB_URI;

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

/**
 * NON AUTH ROUTES
 */

app.post('/signup', registerUser);

app.post('/login', loginUser);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 *  Preface: These routes have been built with REST and resource heirarchy in mind, meaning that
 *  they have capabilities on an as-needed basis. (ex. there is no route to delete all kitchens at
 *  once). However if there isn't any route that provides what you need please feel free
 *  to create one or let me know and I can create one. Some operations may require multiple requests
 *  chained together.
 *
 *  Note: all fields in the route preceded by ':' (ex. ':userId') should be filled in with the
 *  appropriate object id. For get and delete requests this is the only info you need to provide.
 *  For post requests you will additionally need to provide info within the request body.
 *
 *  User routes:
 *    Creating a user (account creation): post /users
 *    Deleting a specific user (account deletion): delete /users/:id
 *      - The backend will automatically delete any relevant memberships and owned kitchens.
 *    List all users (includes name and createdAt): get /users
 *    To list just one user: .get /users/:id
 *
 *  Memberships:
 *    Given a specific user, see what kitchens they are a member of: get /users/:userId/memberships
 *    For a specific kitchen, see which users are a member: get /kitchens/:kitchenId/memberships
 *    Create a membership between a user and a kitchen: post /memberships
 *    Delete a membership: delete /memberships/:id
 *
 *  Kitchens:
 *    Get a list of all kitchens: get /kitchens
 *      - Doesn't contain nested info such as inventories or items within.
 *    Get info about a kitchen: get /kitchens/:id
 *      - This contains a list of inventories within the kitchen. Doesn't contain nested info
 *        like which items are within the inventories. To see items, see the section below about
 *        getting info from specific inventories.
 *    Create a kitchen: post /kitchens
 *    Delete a kitchen: delete /kitchens/:id
 *      - The backend will automatically delete all inventories and items within this kitchen
 *        as well as any memberships containing this kitchen.
 *
 *  Inventories:
 *  Inventories always exist within a kitchen, so they will be a subroute of a specfic kitchen.
 *  There is a strict parent-child relationship so an inventory instance cannot be a part of multiple kitchens.
 *    Create an inventory: post kitchens/:kitchenId/inventories
 *    Delete an inventory: delete kitchens/:kitchenId/inventories/:id
 *      - This will delete all items within the inventory as well
 *    To see a list of inventories within a kitchen, see /kitchens/:id in the above section
 *    To get info about an inventory along with all the items in it:
 *      get /kitchens/:kitchenId/inventories/:id
 *
 *  Items:
 *  Items always exist within an inventory, so they will be a subroute of a specific inventory.
 *  There is a strict parent-child so one instance of an item cannot be a part of multiple inventories.
 *    Create an item: post /kitchens/:kitchenId/inventories/:inventoryId/items
 *    Delete an item: delete /kitchens/:kitchenId/inventories/:inventoryId/items/:id
 *    Getting info about a specific item: I assume this will be done at the inventory level.
 *      See in the above section get /kitchens/:kitchenId/inventories/:id
 */

/**
 * GET ROUTES
 */

app.get('/users/:userId/memberships', authenticateUser, (req, res) => {
  const userId = req.params.userId;

  userServices
    .findUserById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      return memberServices.getMembersByUserId(userId);
    })
    .then((memberships) => {
      res.send({ members_list: memberships });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error fetching memberships');
    });
});

app.get('/users/:id', authenticateUser, (req, res) => {
  const id = req.params['id'];
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

app.get('/users', authenticateUser, (req, res) => {
  userServices
    .getUsers(req.query.name, req.query.createdAt)
    .then((users) => {
      return res.send({ users_list: users });
    })
    .catch((error) => console.log(error));
});

app.get('/kitchens/:kitchenId/memberships', authenticateUser, (req, res) => {
  const kitchenId = req.params.kitchenId;

  kitchenServices
    .findKitchenById(kitchenId)
    .then((kitchen) => {
      if (!kitchen) {
        return res.status(404).send('Kitchen not found');
      }
      return memberServices.getMembersByKitchenId(kitchenId);
    })
    .then((memberships) => {
      res.send({ members_list: memberships });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error fetching memberships');
    });
});

app.get(
  '/kitchens/:kitchenId/inventories/:id',
  authenticateUser,
  (req, res) => {
    const kitchenId = req.params.kitchenId;
    const id = req.params.id;

    kitchenServices
      .findKitchenById(kitchenId)
      .then((kitchen) => {
        if (!kitchen) {
          return res.status(404).send('Kitchen not found');
        }
        return inventoryServices.findInventoryById(id);
      })
      .then((inventory) => {
        if (!inventory) {
          return res.status(404).send('Inventory not found');
        }
        res.send(inventory);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send('Resource not found.');
      });
  }
);

app.get('/kitchens/:id', (req, res) => {
  // Includes list of inventories within this kitchen
  const id = req.params['id'];

  kitchenServices
    .findKitchenById(id)
    .then((kitchen) => {
      res.send(kitchen);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send('Resource not found.');
    });
});

app.get('/kitchens', (req, res) => {
  // List all kitchens. Will not include inventories. Use kitchens/:id to get inventories
  kitchenServices
    .getKitchen(req.query.name, req.query.owner, req.query.createdAt)
    .then((kitchens) => {
      return res.send({ kitchen_list: kitchens });
    })
    .catch((error) => console.log(error));
});

/**
 * POST ROUTES
 */

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

app.post('/memberships', authenticateUser, (req, res) => {
  let memberToAdd = req.body;
  memberToAdd.createdBy = req.userId;

  memberServices
    .addMember(memberToAdd)
    .then((item) => {
      memberToAdd = item;
      res.status(201).send(memberToAdd);
    })
    .catch((error) => console.log(error));
});

app.post(
  '/kitchens/:kitchenId/inventories/:inventoryId/items',
  authenticateUser,
  (req, res) => {
    const kitchenId = req.params.kitchenId;
    const inventoryId = req.params.inventoryId;
    let itemToAdd = req.body;
    itemToAdd.createdBy = req.userId;

    kitchenServices
      .findKitchenById(kitchenId)
      .then((kitchen) => {
        if (!kitchen) {
          return res.status(404).send('Kitchen not found');
        }
        return inventoryServices.addItemToInventory(inventoryId, itemToAdd);
      })
      .then((inventory) => {
        const addedItem = inventory.items[inventory.items.length - 1];
        res.status(201).send(addedItem);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error adding item');
      });
  }
);

app.post('/kitchens/:kitchenId/inventories', authenticateUser, (req, res) => {
  const kitchenId = req.params.kitchenId;
  let inventoryToAdd = req.body;
  inventoryToAdd.createdBy = req.userId;

  kitchenServices
    .findKitchenById(kitchenId)
    .then((kitchen) => {
      if (!kitchen) {
        return res.status(404).send('Kitchen not found');
      }

      return inventoryServices.addInventory(inventoryToAdd);
    })
    .then((inventory) => {
      return kitchenServices
        .addInventoryToKitchen(kitchenId, inventory._id)
        .then(() => inventory);
    })
    .then((inventory) => {
      res.status(201).send(inventory);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error creating inventory');
    });
});

app.post('/kitchens', authenticateUser, (req, res) => {
  let kitchenToAdd = req.body;
  kitchenToAdd.owner = req.userId;

  kitchenServices
    .addKitchen(kitchenToAdd)
    .then((kitchen) => {
      kitchenToAdd = kitchen;
      res.status(201).send(kitchenToAdd);
    })
    .catch((error) => console.log(error));
});

/**
 * DELETE ROUTES
 */

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

app.delete(
  '/kitchens/:kitchenId/inventories/:inventoryId/items/:id',
  authenticateUser,
  (req, res) => {
    const kitchenId = req.params.kitchenId;
    const inventoryId = req.params.inventoryId;
    const id = req.params.id;

    kitchenServices
      .findKitchenById(kitchenId)
      .then((kitchen) => {
        if (!kitchen) {
          return res.status(404).send('Kitchen not found');
        }
        return inventoryServices.removeItemFromInventory(inventoryId, id);
      })
      .then((inventory) => {
        if (!inventory) {
          return res.status(404).send('Inventory not found');
        }
        console.log(`Deleted item ${id}`);
        res.status(204).send();
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error deleting item');
      });
  }
);

app.delete(
  '/kitchens/:kitchenId/inventories/:id',
  authenticateUser,
  (req, res) => {
    const kitchenId = req.params.kitchenId;
    const id = req.params.id;

    inventoryServices
      .deleteInventoryById(id)
      .then((inventory) => {
        if (!inventory) {
          return res.status(404).send('Inventory not found');
        }
        return kitchenServices.removeInventoryFromKitchen(kitchenId, id);
      })
      .then(() => {
        console.log(`Deleted inventory ${id}`);
        res.status(204).send();
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error deleting inventory');
      });
  }
);

app.delete('/kitchens/:id', (req, res) => {
  const id = req.params['id'];
  kitchenServices
    .deleteKitchenById(id)
    .then((kitchen) => {
      console.log(`Deleted kitchen ${kitchen.id}`);
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
