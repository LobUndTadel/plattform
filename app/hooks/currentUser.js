var User = Risotto.models.user;
var thunkify = require('thunkify');
	User.findOne = thunkify(User.findOne);

Risotto.before('controller', function*(koaContext, route, data, next){
	if(!koaContext.session || !koaContext.session.authorized){
		return;
	}
	
	try{
		var user = yield User.findOne({ id: koaContext.session.data.id });
	} catch(err){
		return;
	}

	data.currentUser = user;
});