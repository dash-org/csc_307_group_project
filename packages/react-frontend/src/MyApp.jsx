// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { DashboardEmpty } from './Dashboard/dash';
import { InventoryEmpty } from './Inventory/inventory';
import { HomepageBlank } from './Homepage/home';
import { SignCentered } from './SignPage/Sign';
import { LoginCentered } from './LoginPage/Login2';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PantrySetupCreate } from './NewKitchen/newkitchen';
import { PantrySetupInvited } from './ManageMember/managemember';
import { KitchenPage } from './Kitchenpage/kitchen';
import { InventorySetupCreate } from './NewInventory/newiventory';
import { ItemSetupCreate } from './NewItem/newitem';
import { Navigate } from 'react-router-dom';

function MyApp() {
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const INVALID_USER = 'INVALID_USER';
  const API_PREFIX = 'https://sider.azurewebsites.net';
  // const API_PREFIX = 'http://localhost:8000';
  /*
  The value of token upon booting the frontend is what is stored in local storage, 
  if its not found in local storage then it is set to INVALID_TOKEN
   */
  const [token, setToken] = useState(
    localStorage.getItem('authToken') ?? INVALID_TOKEN
  );
  const [user, setUser] = useState(
    localStorage.getItem('user') ?? INVALID_USER
  );
  const [, setMessage] = useState(''); // Errors are currently not being displayed

  /*
  This useState allows us to rerender the page whenever an error occurs and display the error on the page.
  For now this is just the login page and rerenders whenever the login request fails
  */
  const [error, setError] = useState(0);

  const windowSize = useWindowResize();

  console.log('Resizing:', windowSize);

  const [membershipError, setMembershipError] = useState(0);

  /*
  Populates the header of your request automatically
  Info such as the token is required by the backend for requests all requests aside from signup/login
  It has a dependency on token, so everytime token changes, the content populated by addAuthHeader will also change
  */
  const addAuthHeader = useCallback(
    (otherHeaders = {}) => {
      if (token === INVALID_TOKEN) {
        console.log('still invalid');
        return otherHeaders;
      } else {
        console.log('adding token to header');
        return {
          ...otherHeaders,
          Authorization: `Bearer ${token}`,
        };
      }
    },
    [token]
  );

  /*
  This is called everytime the user submits the login form on the login page, which sends a post request with the
  credentials in the body. Based on the response, we either set token and redirect to the main page, or we set error
  */
  function loginUser(creds) {
    const promise = fetch(`${API_PREFIX}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          setMessage(`Login Error ${response.status}: ${response.data}`);
          setError(1);
          console.log('test12345');
        }
      })
      .then((json) => {
        setToken(json.token);
        localStorage.setItem('authToken', json.token);

        setUser(json.name);
        localStorage.setItem('user', json.name);

        setMessage(`Login successful; auth token saved`);
        window.location.assign('/');
        setError(0);
        console.log('sanity check');
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
      });

    return promise;
  }

  /*
  signupUser() is ver similar to loginUser, refer to it for additional documentation
  */
  function signupUser(creds) {
    const promise = fetch(`${API_PREFIX}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then((payload) => {
            setToken(payload.token);
            localStorage.setItem('authToken', payload.token);

            setUser(payload.name);
            localStorage.setItem('user', payload.name);
            postUser({
              name: creds.username,
              hashpassword: payload.hashpassword,
            });
          });
          setMessage(
            `Signup successful for user: ${creds.username}; auth token saved`
          );
        } else {
          setMessage(`Signup Error ${response.status}: ${response.data}`);
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });

    return promise;
  }

  /*
  Normally you would need to update the frontend whenever you add a user, but adding a user requires them to signup.
  Which causes a page reload anyways allowing us to render the new user.
  */
  function postUser(person) {
    const promise = fetch(`${API_PREFIX}/users`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(person),
    });

    return promise;
  }

  /*
  Generic post request for creating a kitchen, upon succeeding it directs a client to the home page
  */
  function postKitchen(creds) {
    const promise = fetch(`${API_PREFIX}/kitchens`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('sanity check');
          window.location.assign('/home');
        } else {
          console.log('test12345');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }

  /*
  This post request requires the kitchenId in order to create a proper inventory. 
  MyApp.jsx won't know what inventory the kitchen belongs to, which means that the component calling
  will need to supply the kitchenId. In this case, the createInventory page gets the kitchenId from its URL route so it can easily supply it
  */
  function postInventory(creds, kitchenId) {
    const promise = fetch(`${API_PREFIX}/kitchens/${kitchenId}/inventories`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('sanity check');
          window.location.assign(`/kitchens/${kitchenId}`);
        } else {
          console.log('test12345');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }

  /*
  Very similar to postInventory up above
  */
  function postMembership(username, role, kitchenId) {
    const promise = fetch(`${API_PREFIX}/memberships`, {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        kitchenId: kitchenId,
        role: role,
        userName: username,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          console.log('sanity check');
          setMembershipError(0);
          window.location.assign(`/kitchens/${kitchenId}`);
        } else {
          setMembershipError(1);
          console.log('test12345');
        }
      })
      .catch((error) => {
        setMembershipError(1);
        console.log(error);
      });
    return promise;
  }

  /*
  Very similar to postInventory up above
  */
  function postItem(creds, kitchenId, inventoryId) {
    const promise = fetch(
      `${API_PREFIX}/kitchens/${kitchenId}/inventories/${inventoryId}/items`,
      {
        method: 'POST',
        headers: addAuthHeader({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(creds),
      }
    )
      .then((response) => {
        if (response.status === 201) {
          console.log('sanity check');
          window.location.assign(
            `/kitchens/${kitchenId}/inventories/${inventoryId}`
          );
        } else {
          console.log('test12345');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return promise;
  }

  /*
  We give API_PREFIX and addAuthHeader to the dashboard, homepage, and kitchen page 
  to allow for them to have delete functions within their page components
  */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/kitchens/:kitchenId/inventories/:inventoryId/item/create"
          element={<ItemSetupCreate handleSubmit={postItem} />}
        />
        {/* Goes to Dashboard when click on view in inventories under kitchen */}
        <Route
          path="/kitchens/:kitchenId/inventories/:inventoryId"
          element={
            <DashboardEmpty
              API_PREFIX={API_PREFIX}
              addAuthHeader={addAuthHeader}
              currentUser={user}
            />
          }
        />
        <Route
          path="/home"
          element={
            <HomepageBlank
              addAuthHeader={addAuthHeader}
              API_PREFIX={API_PREFIX}
              currentUser={user}
            ></HomepageBlank>
          }
        />
        <Route
          path="/kitchens/:id"
          element={
            <KitchenPage
              addAuthHeader={addAuthHeader}
              API_PREFIX={API_PREFIX}
              currentUser={user}
            />
          }
        />
        <Route
          path="/kitchens/:id/inventories/create"
          element={
            <InventorySetupCreate
              handleSubmit={postInventory}
            ></InventorySetupCreate>
          }
        />
        <Route path="/inventory" element={<InventoryEmpty></InventoryEmpty>} />
        <Route
          path="/kitchens/create"
          element={
            <PantrySetupCreate handleSubmit={postKitchen}></PantrySetupCreate>
          }
        />
        <Route
          path="/kitchens/:kitchenId/memberships/create"
          element={
            <PantrySetupInvited
              handleSubmit={postMembership}
              error={membershipError}
            ></PantrySetupInvited>
          }
        />
        <Route
          path="/"
          // element={
          //   <div className="container">
          //     <Table
          //       characterData={characters}
          //       removeCharacter={removeOneCharacter}
          //     />
          //     {/* <Form handleSubmit={updateList} /> */}
          //   </div>
          // }
          element={<Navigate to="/home" replace />}
        />
        <Route
          path="/login"
          element={<LoginCentered handleSubmit={loginUser} error={error} />}
        />
        <Route
          path="/signup"
          // element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />}
          element={<SignCentered handleSubmit={signupUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function useWindowResize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default MyApp;
