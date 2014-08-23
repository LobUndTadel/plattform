var User = Risotto.models.user;
var thunkify = require('thunkify');
	User.create = thunkify(User.create);

/**
 * Validates hfu email address.
 */

function isValidEmail(email){
	return /(.+)\.(.+)\@hs\-furtwangen\.de/.test(String(email));
}


module.exports = Risotto.Controller.extend({
	loginForm: function*(){
		// renders login form
		if(this.currentUser){
			this.redirect('/')
		} else {
			yield this.render('user/loginForm');
		}
	},

	login: function*(params){
		if(!params.password || !params.email){
			return yield this.render('user/loginForm', {error: 'Bitte alle Felder ausfüllen'});
		}

		var user = yield User.findOne({'email': params.email});
		
		if(!user || false == (yield user.comparePassword(params.password))){
			return yield this.render('user/loginForm', {error: 'Email oder Passwort falsch'});
		}

		this.session = {
			authorized: true,
			user_id: user.id
		}

		//user.signInCount = user.signInCount + 1;
		//yield user.save();
	
		this.redirect('/');
	},

	logout: function*(params){
		this.session = null;
		this.redirect('/');
	},

	/**
	 * [GET] user/register
	 */

	registerForm: function*(params){
		yield this.render('user/registerForm');
	},

	/**
	 * [POST] user/register
	 */

	register: function*(params){
		if(!params.password || !params.email || !isValidEmail(params.email)){
			return yield this.render('user/registerForm', {error: 'Bitte alle Felder ausfüllen'});
		}

		var values = params.take('password', 'email');

		// build up username, lastName & firstName from email
		var username = values.email.replace(/\@hs\-furtwangen\.de/, ''),
        	name = username.split(/\./);

		values.firstName = name[0].charAt(0).toUpperCase() + name[0].slice(1)
		values.lastName = name[1].charAt(0).toUpperCase() + name[1].slice(1)
		values.username = username

		try{
			var user = yield User.create(values);
		} catch(err){
			return yield this.render('user/registerForm', {error: err.details });
		}

		// login & save id
		this.session = {
			authorized: true,
			user_id: user.id
		}

		this.redirect('/' + user.username + '/welcome');
	}
})	