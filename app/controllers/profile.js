module.exports = Risotto.Controller.extend({
	beforeFilter: ['authorize', 'user'],
	welcome: function*(){
		yield this.render('profile/welcome',{user: this.user});
	},
})