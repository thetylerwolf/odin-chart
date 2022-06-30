import Parse from 'parse';

import {
  createCopy,
  getStringHash,
} from './index';
import { Read } from './dataAccess';

export const logIn = (email, password) =>
  new Promise((resolve, reject) => {
    Parse.User.logIn(email, password)
      .then(user => resolve(user))
      .catch(reject);
  });

export const logOut = () =>
  new Promise((resolve, reject) => {
    Parse.User.logOut()
      .then(() => resolve())
      .catch(reject);
  });

export const getCurrentUser = (
  parseJson = true,
  fromServer = false,
) =>
  new Promise((resolve, reject) => {
    const parseUser = Parse.User.current();

    if (parseUser) {
      if (fromServer === true) {
        const query = new Parse.Query(Parse.User);

        query
          .get(parseUser.id)
          .then(user =>
            resolve(
              parseJson === false
                ? user
                : createCopy(user),
            ),
          )
          .catch(reject);
      } else {
        resolve(
          parseJson === false
            ? parseUser
            : createCopy(parseUser),
        );
      }
    } else {
      resolve(null);
    }
  });

export const getUserByEmail = email =>
  Read(Parse.User, {
    equalTo: [['email', email]],
  });

export const createUser = (
  email,
  password,
  fullName,
  googleUser
) => {
  const user = new Parse.User();

  if (googleUser) {
    user.setUsername(googleUser.w3.U3);
    user.setPassword(
      getStringHash(googleUser.w3.U3),
    );
    user.setEmail(googleUser.w3.U3);
    user.set('fullName', googleUser.w3.ig);
    user.set('type', 'google');
    user.set('token', googleUser.Zi.access_token);
  } else {
    user.setUsername(email);
    user.setPassword(password);
    user.setEmail(email);
    user.set('fullName', fullName);
  }

  return user.signUp();
};

export const updateUser = (fullName, email) =>
  new Promise((resolve, reject) => {
    const user = Parse.User.current()
      if (user) {
        user.setUsername(email || user.email);
        user.setEmail(email || user.email);
        user.set(
          'fullName',
          fullName || user.fullName,
        );
        user
          .save()
          .then(u => resolve(u))
          .catch(reject);
      } else {
        reject(new Error("User doesn't exist"));
      }
  });

export const deleteUser = id =>
  new Parse.Query(Parse.User)
    .get(id)
    .then(user => user.destroy());

export const changePassword = (
  username,
  oldPassword,
  newPassword,
) =>
  new Promise((resolve, reject) => {
    Parse.User.logIn(username, oldPassword)
      .then((user) => {
        user.setPassword(newPassword);
        user
          .save()
          .then(u => resolve(u))
          .catch(reject);
      })
      .catch(() =>
        reject(
          new Error('Incorrect old password'),
        ),
      );
  });

export const resendEmail = () =>
  new Promise((resolve, reject) => {
    Parse.User.current().set('email', Parse.User.current().get('email'));
    Parse.User.current().save()
      .then((user) => {
        resolve(user);
      })
      .catch(() =>
        reject(
          new Error('Error occoured while sending Email'),
        ),
      );
  });
