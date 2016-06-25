var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var mailerService = require('./mailer');
var User = require('../models/user');

function generateToken(user) {
  var payload = {
    iss: 'my.website',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Get all users
 * May want to restrict this
 */
module.exports.getUsers = function() {
  return new Promise((resolve, reject) => {
    User
    .find({})
    .select('_id name email location active')
    .exec((err, users) => {
      if (err) {
        reject({msg: "Could not retreive users", error: err});
      } else {
        resolve(users);
      }
    });
  });
};

/**
 * Login
 */
module.exports.login = function(email, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, user) => {
      if (!user) {
        return reject({ msg: 'The email address ' + email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'});
      }
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          return reject({ msg: 'Invalid email or password' });
        } else if(user.active === false) {
          return reject({msg: 'You must confirm your email address prior to logging in.  Please refer to the email sent when you registered.'});
        }
        resolve({token: generateToken(user), user: user.toJSON()});
      });
    });
  });
};

/**
 * Create a new user
 */
module.exports.signup = function(name, email, password, isActive, host) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        return reject({ msg: 'The email address you have entered is already associated with another account.'});
      }

      // Generate Activation Token
      new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          var token = buf.toString('hex');
          if (err) {
            return reject(err);
          }
          resolve(token);
        });
      })
      .then((token) => {
        // Create user
        user = new User({
          name: name,
          email: email,
          password: password,
          active: isActive || false,
          activationToken: token,
          activationTokenExpires: Date.now() + 604800000 // expire in 7 days
        });
        // Save user
        user.save((err) => {
          if (err) {
            return reject({msg: 'Your account could not be created', error: err});
          }
          // Send activation token
          if (!isActive) {
            var email= {
              to: user.email,
              from: 'support@myapp.net',
              subject: '✔ Activate your account',
              text: 'You are receiving this email because you registered for an account on myapp\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + host + '/activate?token=' + user.activationToken + '\n\n'
            };

            mailerService.sendMail(email.to, email.subject, email.text, null, email.from)
            .then((mailerResponse) => {
              resolve({ msg: 'An email has been sent to ' + user.email + ' to confirm the email address with this account. The link will be active for 7 days' });
            })
            .catch((err) => {
              // email send failed
              reject({msg: 'Could not send activation email.  Account has been created, please contact and administrator', error: err});
            });
          } else {
            resolve({msg: 'Your account has been created', token: generateToken(user), user: user.toJSON()});
          }

        });
      })
      .catch((err) => {
        reject({msg: 'Failed generating activation token. Account not saved, please contact an administrator', error: err});
      });
    });
  });
};

/**
 * Activate account
 */
module.exports.activateAccount = function(token) {
  return new Promise((resolve, reject) => {
    User.findOne({ activationToken: token })
    .where('activationTokenExpires').gt(Date.now())
    .exec((err, user) => {
      if (err || !user) {
        return reject({msg: 'Token is not valid or user does not exist'});
      }
      user.active = true;
      user.activationToken = undefined;
      user.activationTokenExpires = undefined;
      user.save((err) => {
        if (err) {
          reject({ msg: 'Error activating account', error: err });
        } else {
          resolve({ token: generateToken(user), user: user });
        }
      });
    });
  });
};

/**
 * Update account.  If password provided, that will be the only update, otherwise all other fields updated.
 */
module.exports.updateAccount = function(id, email, name, location, password) {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (password) {
        user.password = password;
      } else {
        user.email = email;
        user.name = name;
        user.location = location;
      }
      user.save((err) => {
        if (err && err.code === 11000) {
          return reject({ msg: 'The email address you have entered is already associated with another account.' });
        } else if (err) {
          return reject({msg: 'Error updating account'});
        } else {
          if (password) {
            return resolve({ msg: 'Your password has been changed.' });
          }
          return resolve({ user: user, msg: 'Your profile information has been updated.' });
        }
      });
    });
  });
};

/**
 * Delete account
 */
module.exports.deleteAcct = function(id) {
  return new Promise((resolve, reject) => {
    User.remove({ _id: id }, (err) => {
      if (err) {
        return reject({msg: 'Error deleting account', error: err});
      }
      resolve({ msg: 'Your account has been permanently deleted.' });
    });
  });
};

/**
 * Forgot password
 */
module.exports.forgot = function(email, host) {
  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) =>{
        var token = buf.toString('hex');
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    })
    .then((token) => {
      User.findOne({ email: email }, (err, user) =>{
        if (!user) {
          return reject({ msg: 'The email address ' + email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save((err) => {
          var email= {
            to: user.email,
            from: 'support@yourdomain.com',
            subject: '✔ Reset your password',
            text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + host + '/reset?token=' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          mailerService.sendMail(email.to, email.subject, email.text, null, email.from)
          .then((info) => {
            resolve({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
          })
          .catch((err) => {
            reject({msg: 'Reset token was created, but could not be emailed.'});
          });
        });
      });
    })
    .catch((err) => {
      reject({msg: 'There was an error processing the password reset request.'});
    });
  });
};

/**
 * Reset Password
 */
module.exports.reset = function(token, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ passwordResetToken: token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (!user) {
        return reject({ msg: 'Password reset token is invalid or has expired.' });
      }
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save((err) => {
          var email= {
            from: 'support@myapp.net',
            to: user.email,
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          mailerService.sendMail(email.to, email.subject, email.text, null, email.from)
          .then((info) => {
            resolve({ msg: 'Your password has been changed successfully.', token: generateToken(user), user: user.toJSON() });
          })
          .catch((err) => {
            console.log('email confirmation for password reset failed.');
            resolve({ msg: 'Your password has been changed successfully.', token: generateToken(user), user: user.toJSON()});
          });
      });
    });
  });
};