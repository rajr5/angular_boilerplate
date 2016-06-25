(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();

  // Controllers
  var UserController = require('./controllers/user');

////////////// MIDDLEWARE ////////////////////////////



//////////////// HELPERS //////////////////////////////
/**
 * Login required middleware
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    res.json({msg: 'Unauthorized'});
  }
}

/////////////// ROUTES ///////////////////////////////////

  router.put('/account', ensureAuthenticated, UserController.accountPut);
  router.delete('/account', ensureAuthenticated, UserController.accountDelete);
  router.post('/signup', UserController.signupPost);
  router.post('/activate/:token', UserController.activateAccount);
  router.post('/login', UserController.loginPost);
  router.post('/forgot', UserController.forgotPost);
  router.post('/reset/:token', UserController.resetPost);
  router.get('/users', ensureAuthenticated, UserController.getUsers);


  module.exports = router;

})();
