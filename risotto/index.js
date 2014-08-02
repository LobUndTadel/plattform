var flags = require('optimist').argv,
	Logger = require('./src/logger'),
	startup = require('./src/startup'),
	path = require('path'),
	redis = require("redis"),
	methods = require('./src/methods'),
	co = require('co');


/*
 * holds the singleton
 */

var Risotto = {};


/**
 * expose the base controller
 */
Risotto.Controller = require('./src/controller');


/**
 * Risotto initialize
 */

Risotto.initialize = co(function*( base ){ 	
 	this.env = flags.e || 'development';
	this.devMode = (this.env == "development");
	
	this.path = base;

	this.CONFIG = path.join(base, 'config/');
	this.APP = path.join(base, 'app/');

	this.controllers = {};
	this.routes = {};

	this.logger = new Logger(this);

	this.logger.info('Risotto - Welcome');
	this.logger.info('Booting ' + this.env );
	this.logger.info('Version: ' + Risotto.version);

	//globalize Risotto
	global.Risotto = this;

	yield startup.performChecks(this);

	//if all files are present we are good to go
	this.config = require(this.CONFIG + this.env);

	//set log level
	this.logger.levels = this.config.logger.levels;

	yield startup.loadModules(this);

	this.controllers = startup.loadControllers(this);

	//load routes & check them
	this.routes = yield startup.loadRoutes(this);

	//start http
	this.httpServer = require('./src/http')(this);

	//bind routes
	this.httpServer.bind(this.routes);

	process.on('uncaughtException', this.onerror.bind(this));

	//ready to go
	this.logger.info("Ready!");
});

/**
 * expose version
 */

Risotto.version = require('./package.json').version;


/**
 * gettin runnin
 */ 

Risotto.listen = function(){

};

/**
 * error catcher
 */

Risotto.onerror = function(err){

	// throw in dev mode
	if(this.env === 'development') throw err;

	var msg = err.stack || err.toString();

	this.logger.error(msg.replace(/^/gm, '  '));
	this.logger.error();
	this.logger.error();
};

/**
 * method to explizit exit
 */
Risotto.exit = function(err){
	Risotto.logger.error(err);
	process.exit(1); 
};

       
module.exports = Risotto;