var User = Risotto.models.user;

Risotto.before('authorize', function*(){
	if( !this.session.authorized ){
		this.koaContext.status = 403;
		this.koaContext.redirect('/user/login');
		throw new Error('Not authorized');
	}
});