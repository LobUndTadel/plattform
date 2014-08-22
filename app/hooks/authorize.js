Risotto.before('controller', function*(koaContext, route, data, next){
	if( route.authorized ){
		if( !koaContext.session.authorized ){
			koaContext.response.status = 401;
			return;
		}
	}

	yield next;
});