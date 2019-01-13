const auth = require('basic-auth');
const { User } = require('../models/users');


//check if user is exist in db
function authLogin(req, res, next) {auth(req) ?
   User.findOne({ emailAddress: auth(req).name}).exec(function(err, user) {
      user ? next() : res.status(400)
                     .send({ message: "You didn't signup" });

   }) : next();
}

module.exports.authLogin = authLogin;
