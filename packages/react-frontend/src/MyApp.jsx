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

function MyApp() {
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const API_PREFIX = 'http://localhost:8000';
  const [token, setToken] = useState(
    localStorage.getItem('authToken') ?? INVALID_TOKEN
  );
  const [, setMessage] = useState('');
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(0);

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

  const fetchUsers = useCallback(() => {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader(),
    });
    return promise;
  }, [addAuthHeader]);

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

  function postUser(person) {
    const promise = fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: addAuthHeader({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(person),
    });

    return promise;
  }

  function removeOneCharacter(index) {
    const trash = characters.at(index);
    const promise = fetch(`http://localhost:8000/users/${trash._id}`, {
      method: `DELETE`,
      headers: addAuthHeader(),
    });

    promise
      .then((res) => {
        if (res.status == 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        }
      })
      .catch((error) => console.log(error));
  }

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dash" element={<DashboardEmpty></DashboardEmpty>} />
        <Route path="/home" element={<HomepageBlank></HomepageBlank>} />
        <Route path="/inventory" element={<InventoryEmpty></InventoryEmpty>} />
        <Route
          path="/kitchens/create"
          element={<PantrySetupCreate></PantrySetupCreate>}
        />
        <Route
          path="/kitchens/manage"
          element={<PantrySetupInvited></PantrySetupInvited>}
        />
        <Route
          path="/"
          element={
            <div className="container">
              <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
              />
              {/* <Form handleSubmit={updateList} /> */}
            </div>
          }
        />
        {/* <Route path="/login" element={<Login handleSubmit={loginUser} />} />; */}
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
