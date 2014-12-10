var Shot = Risotto.models.shot;
var User = Risotto.models.user;
var Project = Risotto.models.project;
var _ = require('underscore');
var map = require('../helpers/gen-map');
var forEach = require('generator-foreach');

module.exports = Risotto.Controller.extend({
	beforeFilter: ['user'],
	
	show: function*(params){
		var user = yield User.findOne({ username: params.username })
			.populate('projectOwner')
			.populate('projectMember')

		if(!user){
			return yield this.render('error', {
				error: 'Es gibt kein Benutzer mit diesem Namen'
			})
		}

		var projects = [];

		yield forEach(user.projectMember, function*(membership){
			var p = yield Project.findOne({id: membership.project});
			projects.push(p)
		})
		
		var shots = yield Shot.find({ owner: user.id })
			.limit(100)
			.populate('project')
			.populate('owner')
			.populate('comments')
			.populate('likes')

		yield this.render('profile/show', {
			profileUser: user,
			shots: shots,
			user: this.user,
			projects: _.union(projects, user.projectOwner)
		})
	},
})