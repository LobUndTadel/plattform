
var Dashboard = Risotto.Controller.extend({
	index: function() {
		this.renderHTML("dashboard/index", {
			me: this.currentUser
		});
	}
});

module.exports = Dashboard;
