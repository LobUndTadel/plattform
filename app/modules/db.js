var Waterline = require('waterline');
var mysql = require('sails-mysql');
var _ = require('underscore');
var orm = new Waterline();

/**
 * Define models to load here.
 */
var models = ['user'];

exports.initialize = function( app ){
	return function(fn){

		// Load the Models into the ORM
		models.forEach(function(name){
			orm.loadCollection(require('../models/' + name + '.js'));
		})

		// config
		app.config.waterline.adapters = { 'mysql': mysql };
		orm.initialize(app.config.waterline, function(err, models) {
		  app.models = models.collections;
  		  fn(err);
		});
	};
};