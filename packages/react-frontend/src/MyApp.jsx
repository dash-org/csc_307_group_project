// src/MyApp.jsx
import React, { useState, useEffect } from 'react';

import Table from './Table';
import Form from './Form';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function MyApp() {
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const API_PREFIX = 'http://localhost:8000';
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState('');
  const [characters, setCharacters] = useState([]);

  function addAuthHeader(otherHeaders = {}) {
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
  }

  function fetchUsers() {
    const promise = fetch('http://localhost:8000/users', {
      headers: addAuthHeader(),
    });
    return promise;
  }

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
  }, [token]);

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
        }
      })
      .then((json) => {
        setToken(json.token);
        setMessage(`Login successful; auth token saved`);
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
    const promise = fetch('Http://localhost:8000/users', {
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
    const promise = fetch(`Http://localhost:8000/users/${trash._id}`, {
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

  function updateList(person) {
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
        <Route
          path="/"
          element={
            <div className="container">
              <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
              />
              <Form handleSubmit={updateList} />
            </div>
          }
        />
        <Route path="/login" element={<Login handleSubmit={loginUser} />} />;
        <Route
          path="/signup"
          element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default MyApp;
