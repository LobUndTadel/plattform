var koala = require('koala');
var router = require('koa-router');
var serve = require('koa-static');
var session = require('koa-generic-session');
var RedisStore = require('koa-redis');
var redis = require('redis');
var _ = require('underscore');
var Params = require('./params');


/**
 * Expose http.
 * @param {RisottoSingleton} Risotto
 * @api public
 */

module.exports = function(Risotto, routes){
	return new Http(Risotto, routes);	
};

/**
 * Middleware to validate route constraints.
 * @param {Route} route
 * @param {RisottoSingleton} risotto
 * @api private
 */

function risottoMiddleware(route, Risotto){
	return function* risottoMiddlewareClosure(next){
		if( route.authorized ){
			if( !this.session.authorized ){
				this.response.status = 401;
				yield Risotto.application.onAuthorizationError(this, next);
				return;
			}
		}
	}
};

/**
 * Calls the hooks in context and
 * expose the result via `middlewareData`.
 * @param {Generator} next
 * @api private
 */

function* hooksMiddleware(next){
	var data = yield Risotto.callHooks('before', 'controller', this, next);
	this.middlewareData = data;
	yield next;
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
			params.set( _.extend({}, this.req.params, this.req.query, this.req.body, this.req.files));
		
		_.extend( instance, this.middlewareData);
		delete this.middlewareData;

		if(Risotto.devMode){
			Risotto.logger.log(fn[0] + "#" + fn[1] + '(…)' + JSON.stringify(params));
		}

		//make these in the controller available
		instance.koaContext = this;

		yield instance[fn[1]](params);		

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
  			yield Risotto.application.onError(this, next);
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
console.log(routes)
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

	// static serving
	server.use(serve(Risotto.APP + 'public'));


	//.html is the default extension
	/*this.server.set("view engine", "html");

	// render .html files with ejs
	this.server.engine('html', engine);

	//set the views directory
	server.set('views', Risotto.APP + 'views');

	//setup logger for all request
	this.server.use(
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
		this.server[route.via](
			namedRouteFor(route),
			'/' + route.path,
			risottoMiddleware(route),
			hooksMiddleware,
			callRoute(route)
		);
	}, this);
};