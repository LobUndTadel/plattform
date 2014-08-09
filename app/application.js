module.exports = Risotto.Application.extend({
	
	onAuthorizationError : function*(koaContext, next){
		koaContext.redirect('/');
	},

	/*
	onNotFoundError : function*(koaContext, next){
		console.log('app onNotFoundError')
	},
	*/
	onError : function*(koaContext, next){
		console.log('app error');
	}
});