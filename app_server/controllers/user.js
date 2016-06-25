
var userService = require('../services/user');

/**
 * 200 - OK success GET
 * 201 - created success POST
 * 203 - created success PUT
 * 204 - no content success DELETE
 * 400 bad request
 * 401 unathorized
 * 403 forbidden
 * 404 not found
 * 405 method not allowed
 */

var sendJson = function(res, status, content) {
      content = content || {};
      res.status(status);
      res.json(content);
};


  /**
   * GET /users
   * Sign in with email and password
   */
module.exports.getUsers = function(req, res) {
  userService.getUsers()
  .then(function(data) {
    sendJson(res, 200, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });
};


  /**
   * POST /login
   * Sign in with email and password
   */
  module.exports.loginPost = function(req, res) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    userService.login(req.body.email, req.body.password)
    .then(function(data) {
      sendJson(res, 201, data);
    })
    .catch(function(err){
      sendJson(res, 400, err);
    });
  };

/**
 * POST /signup
 */
module.exports.signupPost = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  userService.signup(req.body.name, req.body.email, req.body.password, true, req.headers.host)
  .then(function(data) {
    sendJson(res, 201, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });

};


/**
 * GET /activate/:token
 */
module.exports.activateAccount = function(req, res) {
  // find account with token
  userService.activateAccount(req.params.token)
  .then(function(data) {
    sendJson(res, 201, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });
};


/**
 * PUT /account
 * Update profile information OR change password.
 */
module.exports.accountPut = function(req, res) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  userService.updateAccount(req.user.id, req.body.email, req.body.name, req.body.location, req.body.password)
  .then(function(data) {
    sendJson(res, 203, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });

};

/**
 * DELETE /account
 */
module.exports.accountDelete = function(req, res) {
  userService.deleteAcct(req.user.id)
  .then(function(data) {
    sendJson(res, 204, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });
};


/**
 * POST /forgot
 */
module.exports.forgotPost = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  userService.forgot(req.body.email, req.headers.host)
  .then(function(data) {
    sendJson(res, 204, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });
};

/**
 * POST /reset
 */
module.exports.resetPost = function(req, res) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
      return sendJson(res, 400, errors);
  }
  userService.reset(req.params.token, req.body.password)
  .then(function(data) {
    sendJson(res, 201, data);
  })
  .catch(function(err){
    sendJson(res, 400, err);
  });
};
