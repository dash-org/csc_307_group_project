// src/MyApp.jsx
import React, { useState, useEffect, useCallback } from 'react';

import Table from './Table';
import Form from './Form';
import Login from './Login';
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
  The format of this use state should be used for future tables
   */
  const [characters, setCharacters] = useState([]);

  /*
  This useState allows us to rerender the page whenever an error occurs and display the error on the page.
  For now this is just the login page and rerenders whenever the login request fails
  */
  const [error, setError] = useState(0);

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
  fetchUsers will make a get request with the header populated by addAuthHeader, which means that the request format will change
  everytime addAuthHeader/token changes
  */
  const fetchUsers = useCallback(() => {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader(),
    });
    return promise;
  }, [addAuthHeader]);

  /*
  This useffect depends on fetchUsers and token, which means it runs every time the token changes
  The token is set upon loading the page, so this use effect will run at the start of the page every time
  We get to set the users being displayed based on the response from fetchUsers()
   */
  useEffect(() => {
    console.log('jofifd');
    console.log(token);
    fetchUsers()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setCharacters(json['users_list']);
        } else {
          setCharacters(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchUsers, token]);

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
  Refer to this for future api calls
  Based on the response status, we utilize setCharacters to rerender the table with the updated set of users
  */
  // function removeOneCharacter(index) {
  //   const trash = characters.at(index);
  //   const promise = fetch(`${API_PREFIX}/users/${trash._id}`, {
  //     method: `DELETE`,
  //     headers: addAuthHeader(),
  //   });

  //   promise
  //     .then((res) => {
  //       if (res.status == 204) {
  //         const updated = characters.filter((character, i) => {
  //           return i !== index;
  //         });
  //         setCharacters(updated);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // }

  function _updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status != 201) {
          throw new Error();
        }
        return res.json();
      })
      .then((json) => {
        return setCharacters([...characters, json]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dash" element={<DashboardEmpty></DashboardEmpty>} />
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

export default MyApp;
