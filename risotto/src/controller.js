var _ = require('underscore');
var extend = require('backbone').Model.extend;
var delegate = require('delegates');


/**
 * Expose the BaseController.
 */

module.exports = BaseController;

/**
 * Risotto.Controller
 * is the Base Controller all other Controllers should inherit from.
 */

function BaseController(){}

/**
 * The prototype.
 */

var proto = BaseController.prototype;

_.extend(proto, {
    
    /**
     * Authorizes current request with session `data`.
     */
    
    authorize : function(data){
        this.koaContext.session = {
            authorized : true
        }
    },

    /**
     * Deauthorizes current request.
    */

    deAuthorize : function(){
        this.koaContext.session = null;
    }
});

/**
 * Delegate the `koaContext` methods & accessors to ours
 */

delegate(proto, 'koaContext')
    .method('attachment')
    .method('json')
    .method('url')
    .method('redirect')
    .access('status')
    .access('body')

/**
 * Make it extendable.
 */ 

BaseController.extend = extend;