var Waterline = require('waterline');
var mysql = require('sails-mysql');
var _ = require('underscore');
var orm = new Waterline();
var thunkify = require('thunkify')
orm.initialize = thunkify(orm.initialize, orm)

/**
 * Define models to load here.
 */
var models = ['tag', 'user_role', 'image', 'like', 'comment', 'shot', 'project', 'user', 'project_member', 'notification'];

exports.initialize = function*(){

	// Load the Models into the ORM
	models.forEach(function(name){
		orm.loadCollection(require('../models/' + name + '.js'));
	})

	// config
	Risotto.config.waterline.adapters = { 'mysql': mysql };
	models = yield orm.initialize(Risotto.config.waterline);
	Risotto.models = models.collections;
};