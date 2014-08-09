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
    
    onAuthorizationError : function*(next){

    },

    /**
     * Handle generic errors.
     */

    onError : function*(next){

    },

    /**
     * Handle not found errors.
     */

    onNotFoundError : function*(next){

    }
});


/**
 * Make it extendable
 */

BaseApplication.extend = extend;