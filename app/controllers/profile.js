module.exports = Risotto.Controller.extend({
	welcome: function*(){
		yield this.render('profile/welcome',{user: this.currentUser});
	},
})