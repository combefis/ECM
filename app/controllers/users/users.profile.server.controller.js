'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require( '../errors.server.controller.js' ),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init variables
	var user = req.user;
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayname = user.firstname + ' ' + user.lastname;
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json( user );
				}
			});
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.updateUser = function(req, res) {
	// Init Variables
	var user = req.profile;
	var message = null;
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayname = user.firstname + ' ' + user.lastname;
		var roles = ['user'];
		if (req.body.rights.teacher) roles.push( 'teacher' );
    if ( req.body.rights.manager ) roles.push( 'manager' );
    if ( req.body.rights.admin ) roles.push( 'admin' );
    if ( req.body.rights.printer ) roles.push( 'printer' );
    user.roles = roles;
    user.save( function ( err ) {
      if ( err ) {
        return res.status( 400 ).send( {
          message: errorHandler.getErrorMessage( err )
        } );
      } else {
        req.login( user, function ( err ) {
          if ( err ) {
            res.status( 400 ).send( err );
          } else {
            res.json( user );
          }
        } );
      }
    } );
  } else {
    res.status( 400 ).send( {
      message: 'User is not signed in'
    } );
  }
};

/**
 * Send User
 */
exports.me = function ( req, res ) {
  res.json( req.user || null );
};

/**
 * Delete user
 */
exports.delete = function ( req, res ) {
  var user = req.profile;
  user.remove( function ( err ) {
    if ( err ) {
      return res.status( 400 ).send( {
        message: errorHandler.getErrorMessage( err )
      } );
    } else {
      res.jsonp( user );
    }
  } );
};
