module.exports = Risotto.Controller.extend({
	show: function*(){
		yield this.render('feed');
	}
})