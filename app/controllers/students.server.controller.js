'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Student = mongoose.model('Student'),
	_ = require('lodash');

/**
 * Transform a String (CSV), to array of String
 */


/**
 * Create a student
 */
exports.create = function(req, res) {
	var student = new Student(req.body);
	student.user = req.user;
	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(student);
	});
};

/**
 * Show the current student
 */
exports.read = function(req, res) {
	res.jsonp(req.student);
};

/**
 * Update a student
 */
exports.update = function(req, res) {
	var student = req.student;
	student = _.extend(student, req.body);
	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(student);
	});
};

/**
 * Delete a student
 */
exports.delete = function(req, res) {
	var student = req.student;
	student.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(student);
	});
};

/**
 * List of students
 */
exports.list = function(req, res) { 
	Student.find({}, 'firstname lastname matricule')
		   .sort({'lastname': -1})
		   .exec(function(err, students) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(students);
	});
};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) {
	if (req.method === 'POST') {
		return next();	
	}
	Student.findOne({matricule: id}, 'firstname lastname matricule groups')
	.populate('groups', 'name')
	.exec(function(err, student) {
		if (err) {
			return next(err);
		} 
		if (! student) {
			return next(new Error('Failed to load Student ' + id));
		}

		req.student = student;
		next();
	});
};

/**
 * Student authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.student.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
