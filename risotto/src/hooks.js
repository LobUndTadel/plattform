var forEach = require('generator-foreach');

var hooks = {
	before : { controller : [] },
	after : { controller : [] }
};

/**
 * registers hooks
 */
function registerHook(when, type, fn){
 	if(hooks[when] && hooks[when][type]){
 		hooks[when][type].push(fn);
 	} else {
 		throw new Error('Unrecognized Hook:"' + when + ' ' + type + '"');
 	}
}

/**
 * shorthands
 * @api public
 */
['before', 'after'].forEach(function(when){
 	exports[when] = function(type, fn){
 		registerHook(when, type, fn);
 	};
});

/**
 * use this to invoke the hooks
 * @api private
 */
exports.call = function *(when, type, koaContext, next){
	var data = {};

	yield * forEach(hooks[when][type], function*(fn){
		yield fn(koaContext, next);
	});

	return data;
};