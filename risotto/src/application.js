var _ = require('underscore');
var extend = require('backbone').Model.extend;

/**
 * Expose.
 */

module.exports = BaseApplication;


/**
 * Risotto.Application is the base Application
 */

function BaseApplication(){}

_.extend( BaseApplication.prototype, {
    
    /**
     * Handle authorization errors.
     */
    
    onAuthorizationError : function*(koaContext, next){

    },

    /**
     * Handle generic errors.
     */

    onError : function*(koaContext, next, error){
        throw error;
    },

    /**
     * Handle not found errors.
     */

    onNotFoundError : function*(koaContext, next){

    }
});


/**
 * Make it extendable
 */

BaseApplication.extend = extend;