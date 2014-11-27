var User = Risotto.models.user;

Risotto.before('user', function*(){
	if( !this.session.authorized || !this.session.user_id ){
		return;
	}
	
	try{
		var user = yield User
			.find({ id: this.session.user_id })
			.populate('projectOwner')
			.populate('projectMember')
			.populate('likes')
			.populate('comments')
			.populate('shots')

	} catch(err){
		return console.log(err);
	}

	this.user = user[0];
});