'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Room = mongoose.model('Room'),
	_ = require('lodash');

/**
 * Create a Room
 */
exports.create = function(req, res) {
	var room = new Room(req.body);
	room.user = req.user;
	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * Show the current Room
 */
exports.read = function(req, res) {
	res.jsonp(req.room);
};

/**
 * Update a Room
 */
exports.update = function(req, res) {
	var room = req.room ;

	room = _.extend(room , req.body);

	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * Delete an Room
 */
exports.delete = function(req, res) {
	var room = req.room;

	room.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * List of Rooms
 */
exports.list = function(req, res) { 
	Room.find({}, 'ID name')
		.sort({'ID': 1})
		.exec(function(err, rooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * Room middleware
 */
exports.roomByID = function(req, res, next, id) {
	if (req.method === 'POST') return next();
	Room.findOne({ID : id }, 'ID name seats picture')
		.exec(function(err, room) {
		if (err) return next(err);
		if (! room) return next(new Error('Failed to load room ' + id));
		
		req.room = room ;
		return next();
	});
};

/**
 * Room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.room.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
