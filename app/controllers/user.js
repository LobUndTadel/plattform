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
		this.body = 'hello';
	},

	login: function*(params){

	},

	logout: function*(params){

	},

	/**
	 * [GET] user/register
	 */

	registerForm: function*(params){
		yield this.render('user/registerForm', {navigation: false});
	},

	/**
	 * [POST] user/register
	 */

	register: function*(params){
		if(!params.password || !params.email || !isValidEmail(params.email)){
			return yield this.render('user/registerForm', {navigation: false, error: 'Bitte alle Felder ausfüllen'});
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
			return yield this.render('user/registerForm', {navigation: false, error: err.details });
		}

		yield this.render('user/welcome', { user: user});
	}
})	