(function() {
  'use strict';

  var jwt = require('jsonwebtoken');
  var Users = require('../models/users');
  var Documents = require('../models/documents');
  var parseError = require('./parseError');

  module.exports = {
    addUser: function(req, res) {
      // Declare new instance of the Users "table"
      var user = new Users();

      // Define values of the new "row" to add
      user.username = req.body.username;
      user.name.first = req.body.firstName;
      user.name.last = req.body.lastName;
      user.email = req.body.email;
      user.password = req.body.password;
      user.role = req.body.role;

      user.save(function(error) {
        if (error) {
          parseError(res, error);
        } else {
          // Return send success message
          res.json({
            success: true,
            message: 'User created successfully',
            entry: user
          });
        }
      });
    },
    getAll: function(req, res) {
      // Get all entries in the users "table"
      Users.find({}, function(error, users) {
        //  Inform user if anything goes wrong
        if (error) {
          res.status(500);
          res.send('There was an error reading from the database');
        } else {
          // Else all's good, send results
          res.json(users);
        }
      });
    },
    login: function(req, res) {
      // Look for user in the database
      Users.findOne({
        username: req.body.username
      }, function(error, user) {
        // In case of a server error inform the user
        if (error) {
          res.status(500);
          res.send('There was an error reading from the database');
        }

        // User not in the database
        if (!user) {
          res.json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else {
          // Verify provided password is valid
          user.validatePassword(req.body.password, function(error, isMatch) {
            if (error) {
              throw error;
            }
            if (isMatch) {
              // All's good, create a token
              var token = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: '90 days'
              });

              // Return token and success message in JSON
              res.json({
                success: true,
                message: 'You\'ve successfully been logged in.',
                token: token,
                entry: user
              });
            }
            // Passwords do not match
            else {
              res.json({
                success: false,
                message: 'Authentication failed. Wrong password.'
              });
            }
          });
        }
      });
    },
    getDocumentsById: function(req, res) {
      // Get all entries in the users "table" based on provided id
      Documents.find({
        'owner_id': req.params.id
      }, function(error, users) {
        //  Inform user if anything goes wrong
        if (error) {
          res.status(500);
          res.send('There was an error reading from the database');
        } else {
          // Else all's good, send results
          res.json(users);
        }
      });
    },
    getUser: function(req, res) {
      // Get all entries in the users "table" based on provided id
      Users.find({
        '_id': req.params.id
      }, function(error, users) {
        //  Inform user if anything goes wrong
        if (error) {
          res.status(500);
          res.send('There was an error reading from the database');
        } else {
          // Else all's good, send results
          res.json(users);
        }
      });
    },
    updateUser: function(req, res) {
      // Return all entry in Users "table" with provided id
      Users.find({
        '_id': req.params.id
      }, function(find_error, users) {
        // In case of error inform user
        if (find_error) {
          console.log(find_error);
          res.status(500);
          res.send('Error reading from database');
        } else{
          if (users) {
            // Update each entry found
            users.forEach(function(user) {
              // For every object property in the body
              // Update it's corresponding db property
              Object.keys(req.body).forEach(function(property) {
                // Special cases for first and last names
                if (property === 'firstName') {
                  user.name.first = req.body.firstName;
                } else if (property === 'lastName') {
                  user.name.last = req.body.lastName;
                } else {
                  user[property] = req.body[property];
                }

                // "Row" can now have an updated value
                user.updated = new Date();
              });

              // Save the updated "row"
              user.save(function(save_error) {
                // If error occured inform user
                if (save_error) {
                  res.status(500);
                  res.send('Error saving to database');
                }
              });
            });
            // Return successfully updated object
            res.json({
              success: true,
              message: 'User updated successfully',
              entry: users[0]
            });
          } else {
            // Inform user of error
            res.json({
              success: false,
              message: 'User does not exist',
            });
          }
        }
      });
    },
    deleteUser: function(req, res) {
      // Delete entry with provided id
      Users.remove({
        '_id': req.params.id
      }, function(delete_error, delete_status) {
        if (delete_error) {
          res.status(500);
          res.send('Error deleting from database');
        } else {
          if (delete_status.result.n > 0) {
            res.json({
              success: true,
              message: 'User deleted successfully'
            });
          } else {
            res.json({
              // 'status': status,
              success: false,
              message: 'User does not exist'
            });
          }
        }
      });
    }
  };
})();
