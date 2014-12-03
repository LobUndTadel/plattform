var Shot = Risotto.models.shot;

module.exports = Risotto.Controller.extend({
	beforeFilter: ['user'],
	show: function*(){
		var shots = yield Shot.find()
			.limit(100)
			.populate('project')
			.populate('owner')

		yield this.render('feed/show', {
			shots: shots,
			user: this.user
		})
	}
})