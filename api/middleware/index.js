const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models/users');

function requiresLogin(req, res, next) {
  const credentials = auth(req);
  if (credentials) {
    // check if the user has registered
    let user = User.findOne({ emailAddress: credentials.name });
    if (!user) {
      return res.status(400)
          .send(
              { message: 'There is no user matching the given email address.' });
    }
    // decrypt the password saved in MongoDB and compare with user's input password
    const result = bcrypt.compare(credentials.pass, user.password);
    if (!result) {
      return res.status(401).send({ message: 'Wrong email or password.' });
    }
      // email and password matched, user credential checked.
      return next();

  } else {
    const err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}


module.exports.requiresLogin = requiresLogin;
