import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userServices from './services/user-services.js';
import dotenv from 'dotenv';

dotenv.config();

export function registerUser(req, res) {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    res.status(400).send('Bad request: Invalid input data.');
  } else {
    userServices.getUsers(username).then((users) => {
      if (users.length > 0) {
        res.status(409).send('Username already taken');
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(pwd, salt))
          .then((hashedPassword) => {
            return userServices.addUser({
              name: username,
              hashpassword: hashedPassword,
            });
          })
          .then((newuser) => {
            generateAccessToken(newuser._id)
              .then((token) => {
                console.log('Token:', token);

                res.status(201).send({
                  token: token,
                  hashpassword: newuser.hashedPassword,
                  name: newuser.name,
                });
              })
              .catch(() =>
                res.status(400).send('Failed to add user to database')
              );
          });
      }
    });
  }
}

function generateAccessToken(userId) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token received');
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        req.userId = decoded.userId;
        next();
      } else {
        console.log('JWT error:', error);
        res.status(401).end();
      }
    });
  }
}

export function loginUser(req, res) {
  const { username, pwd } = req.body;

  userServices.getUsers(username).then((users) => {
    if (users.length < 1) {
      res.status(401).send('Unauthorized');
    } else {
      const user = users[0];
      bcrypt
        .compare(pwd, user.hashpassword)
        .then((matched) => {
          if (matched) {
            generateAccessToken(user._id).then((token) => {
              res.status(200).send({ token: token });
            });
          } else {
            res.status(401).send('Unauthorized');
          }
        })
        .catch(() => {
          console.log('ERJOIJ');
          res.status(401).send('Unauthorized');
        });
    }
  });
}
