'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rooms = require('../../app/controllers/rooms.server.controller');
	var multiparty = require('connect-multiparty');

	var canview = ['admin', 'manager', 'printer'];
	var canedit = ['admin'];

	// Rooms Routes
	app.route('/rooms')
	   .get(users.hasAuthorization(canview), rooms.list)
	   .post(users.hasAuthorization(canedit), rooms.create);

	app.route('/rooms/:roomId')
	   .get(users.hasAuthorization(canview), rooms.read)
	   .post(users.hasAuthorization(canedit), rooms.create)
	   .put(users.hasAuthorization(canedit), rooms.update)
	   .delete(users.hasAuthorization(canedit), rooms.delete);

	app.route('/upload/room')
	   .post(users.hasAuthorization(canedit), multiparty(), rooms.upload);

	// Binding the room middleware
	app.param('roomId', rooms.roomByID);
};
