var koala = require('koala');
var router = require('koa-router');
var render = require('koa-ejs');
var serve = require('koa-static');
var session = require('koa-generic-session');
var RedisStore = require('koa-redis');
var redis = require('redis');
var _ = require('underscore');
var Params = require('./params');
var path = require('path');


/**
 * Expose http.
 * @param {RisottoSingleton} Risotto
 * @api public
 */

module.exports = function(Risotto, routes){
	return new Http(Risotto, routes);	
};


/**
 * Calls the hooks in context and
 * expose the result via `middlewareData`.
 * @param {Generator} next
 * @api private
 */

function hooksMiddleware(route){
	return function* hooksMiddleware(next){
		var data = yield Risotto.callHooks('before', 'controller', this, route, next);
		this.middlewareData = data;
		yield next;
	};
};


/**
 * Calls the actual controller specified in `route`.
 * @param {Object} route
 * @api private
 */

function callRoute(route){
	var fn = route.to.split('.');
	
	return function* callRouteClosure(next){
		//lockup controller by name defined into the route and initialize 
		var controller = Risotto.controllers[fn[0]];
		var instance = new controller();

		//merge all into one params object
		var params = new Params();
			params.set( _.extend({},
				this.request.query,
				yield* this.request.urlencoded(),
				yield* this.request.json(),
				this.req.files));
		
		_.extend( instance, this.middlewareData);
		delete this.middlewareData;

		if(Risotto.devMode){
			Risotto.logger.log('-> ' + fn[0] + "." + fn[1] + ' ' + JSON.stringify(params));
		}

		//make these in the controller available
		instance.koaContext = this;

		yield instance[fn[1]](params);

		//render default
		if(!this.type && !this.body){
			yield instance.render(fn.join('/'));
		}		

		delete instance;
	};
};

/**
 * Handler for generic errors.
 * @param {Generator} next
 * @api private
 */

function* errorHandler(next){
	try {
  		yield next;
  		if (404 == this.response.status && !this.response.body) this.throw(404);
	} catch (err) {
  		var status = err.status || 500;

  		if(404 == status){
  			yield Risotto.application.onNotFoundError(this, next);
  		} else {
  			yield Risotto.application.onError(this, next, err);
  		}
  	}
}

/**
 * Returns a route name for `route`.
 * @param route {Object}
 * @api private
 */
function namedRouteFor(route){
	return route.to.replace(/(\/|\.)/g,'_').toLowerCase();
}

/**
 * The Http Constructor
 * @param {RisottoSingleton} Risotto
 * @api public
 */

function Http(Risotto, routes){
	this.routes = routes;

	var server = koala();

	// mount the router
	server.use(router(server));

	// reset error handler
	server.errorHandler = errorHandler;

	// setup session
	var redisClient = redis.createClient( 
		Risotto.config.redis.port || 6379, 
		Risotto.config.redis.host || '127.0.0.1',
		Risotto.config.redis.config || {}
	);

	var redisStore = new RedisStore({
  		client : redisClient
  	});

	redisClient.on('error', function(err){
		Risotto.exit('Failed with ' + err);
	});
		
	server.use(session({
  		store: redisStore
	}));

	server.keys = Risotto.config.http.sessionKeys;

	// static serving
	server.use(serve(Risotto.APP + 'public'));

	/*render(server, {
		root: path.join(Risotto.APP, 'views'),
		layout: 'layout',
		viewExt: 'html',
		cache: false,
		debug: true
	});*/

	//setup logger for all request
	/*this.server.use(
		express.logger({
			format : Yolo.config.http.logger,
			stream : Yolo.logger
		})
	);*/

	server.listen(Risotto.config.http.port);
	
	Risotto.logger.log("HttpServer listening :" + Risotto.config.http.port);

	// expose server
	this.server = server;

	// expose redisClient as `redis` to Risotto
	Risotto.redis = redisClient;

	this.bind();
};

/**
 * Binds the `routes`.
 * @api private
 */

Http.prototype.bind = function(){
	this.routes.forEach(function(route){
		Risotto.logger.info(namedRouteFor(route) + ' ' + route.path + ' -> ' + route.to);
		this.server[route.via](
			namedRouteFor(route),
			route.path,
			hooksMiddleware(route),
			callRoute(route)
		);
	}, this);
};