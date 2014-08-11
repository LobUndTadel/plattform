var fs = require('fs');
var _ = require('underscore');
var	Controller = require('./controller');
var	yaml = require('js-yaml');
var	fs   = require('fs');
var	thunkify = require('thunkify');
var	readFile = thunkify(fs.readFile);
var exec = require('co-exec');


function escapeshell( s ) {
	return s.replace(/(["\s'$`\\])/g,'\\$1').replace(/&/g,'\\&');
};

/**
 * thunkified version of fs.exists
 */

function exists(path){
	return function(fn){
		fs.exists(path, function(a){fn(!a)});
	}
};

/**
 * replaces .js
 */

function formatName(str){
	return str.charAt(0).toUpperCase() + str.slice(1).replace('.js', '');
}

/**
 * check if its a dotfile
 */

function isDotfile(str){
	return str[0] === '.';
};

/**
 * init controllers
 */

function initializeController( path ){
	var Controller = require(path),
		controller_instance = new Controller();

	/** 
	 * each controller have to inherit from the app.Controller
	*/
	
	if( !(controller_instance instanceof Controller)){
		throw new Error("Controller '" + controller + "' expected to be instance of Risotto.Controller");
	}

	return Controller;
}

/**
 * recursivly get all files 
 */

function getAllFiles( rootDir ){

	return (function travel( dir, dirs, traveld ){
		var files;
		
		try{
			files = fs.readdirSync(dir);
		} catch(err){
			return [];
		} 

	    files.forEach(function(file){
	        if (file[0] != '.'){
	        	var filePath = [dir, file].join('/'),
	            	stat = fs.statSync(filePath);

	            if( stat.isDirectory() ){
	            	var copy = traveld.slice();

	            	copy.push(file);
	            	travel(filePath, dirs, copy);
	            } else {
	            	var p = traveld.join('/');
	            	dirs.push({ path : filePath, name: (p ? p + '/' : '' ) + formatName(file) });
	            }
	        }
	    });

	    return dirs;
	})(rootDir, [], []);
}


/**
 * are all folders present?
 */

exports.performChecks = function*( app ){
	var	checks = {
			"Application File" : app.APP + 'application.js',
			"Config File" : app.CONFIG + app.env + '.js',
			"Model dir" : app.APP + 'models',
			"Controller dir" : app.APP + 'controllers/',
			"Route File" : app.CONFIG + 'routes.yml'
		};
	
	for( var check in checks ){
		try{
			yield exists(checks[check]);
		} catch(e){
			app.exit("No " +check+ " searched for: " +checks[check] );
		}
	}
};

/**
 * check the controllers
 */
exports.loadControllers = function(app){
	var path = app.APP + 'controllers',
		controllers = getAllFiles(path),
		l = {};

	controllers.forEach(function( controller ){
		var Controller = initializeController( controller.path );

		/* we added only succesfully intialized controllers */
		if(controller){
			l[controller.name] = Controller;
		}
	}, this);

	return l;
};



exports.loadRoutes = function*( app ){
	var file = yield readFile(app.CONFIG + 'routes.yml', 'utf8'),
		routes = yaml.safeLoad(file),
		safeRoutes = [];
	
	(function routeTraveler( tree, namespace ){

		for( var exp in tree ){
			var matches = exp.match(/(GET|POST|DELETE|PUT)\W+(.+)/);

			if(!matches && _.isObject(tree[exp]) ){
				var next = namespace.slice(0);
				next.push(exp);
				routeTraveler(tree[exp], next);

			} else if(matches) {
				var method = matches[1].toLowerCase(),
					path = matches[2],
					prefix = namespace.join('/'),
					routeOptions =  {
						via : 'get',
						authorized : true
					};

				if(_.isString( tree[exp] )){
					routeOptions = _.extend({}, routeOptions, {
						to : tree[exp]
					});
				} else {
					routeOptions = _.extend({}, routeOptions, tree[exp]);
				}

				routeOptions = _.extend({}, routeOptions, {
					via: method,
					path: prefix ? prefix + '/' + path : path
				});

				if( isValid(routeOptions.to) ){
					safeRoutes.push(routeOptions);
				} else {
					app.logger.warn("Route '"+ routeOptions.path + "' via '" + routeOptions.via + "' is not matching any generatorfunction with: "  + routeOptions.to);
				}
			} else {
				app.logger.warn("Route '" + tree[exp] + "' has invalid format");
			}
		}
	})(routes.routes, []);

	function isValid(fn){
		fn = fn.split('.');

		if( fn[0] in app.controllers ){
			var instance = new app.controllers[ fn[0] ]();
			return instance[fn[1]] && instance[fn[1]].constructor.name == 'GeneratorFunction'
		} 
		return false;
	};

	return safeRoutes;
}

exports.loadModules = function*( app ){
	var path = app.APP + 'modules/',
		initializers = getAllFiles(path);

	try{
		for(var initializer in initializers){
			var module = require(initializers[initializer].path);
			yield module.initialize(app);
		}
	} catch(err){
		app.exit('Initializer "' + initializers[initializer].name + '" failed with: ' + err);
	}
};


exports.loadApplication = function(app){
	var Application = require(app.APP + 'application.js'),
		instance = new Application();

	if(!(instance instanceof app.Application)){
		app.exit('Application expected to be instance of Risotto.Application');
	}

	return instance;
};

exports.loadHooks = function( app ){
	var path = app.APP + 'hooks/',
		hooks = getAllFiles(path);

	try{
		for(var hook in hooks){
			require(hooks[hook].path);
		}
	} catch(err){
		app.logger.warn('Hook "' + hooks[hook].name + '" failed with: ' + err);
	}
};