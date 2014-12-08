module.exports = Risotto.Controller.extend({
	beforeFilter: ['user'],
	
	show: function*(){
		yield this.render('profile/show',{user: this.user});
	},
})