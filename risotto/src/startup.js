var fs = require('fs'),
	_ = require('underscore'),
	Controller = require('./controller'),
	yaml = require('js-yaml'),
	fs   = require('fs'),
	thunkify = require('thunkify'),
	readFile = thunkify(fs.readFile),
	exists = function(path){
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
		var files = fs.readdirSync(dir);

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
				var method = matches[1],
					route = matches[2],
					to = '',
					prefix = namespace.join('/');

				if( ['get', 'post', 'delete', 'put'].indexOf(method) == -1 ){
					app.logger.warn("Method '" + method + "' is not available for route:'" + prefix ? prefix + '/' + route : route);
				}

				if(_.isString( tree[exp] )){
					to = tree[exp];
				} else {
					to = tree[exp].to;
				}
				
				if( isValid(to) ){
					var routeOptions = _.extend({}, {
						via: method,
						to : to,
						route: prefix ? prefix + '/' + route : route
					}, tree[exp]);

					safeRoutes.push(routeOptions);
				} else {
					app.logger.warn("Route '"+ prefix ? prefix + '/' + route : route +"' via '" + method + "' is not matching any function with: "  + to);
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
			return instance[fn[1]] && instance[fn[1]].call 
		} 
		return false;
	};

	console.log(safeRoutes);
	return safeRoutes;
}

exports.loadModules = function*( app ){
	var path = app.APP + 'modules/',
		initializers = getAllFiles(path);

	try{
		for(var initializer in initializers){
			var module = require(initializers[initializer].path);
			yield module.initialize();
		}
	} catch(err){
		app.exit('Initializer "' + initializers[initializer].name + '" failed with: ' + err);
	}
}