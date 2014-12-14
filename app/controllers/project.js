var User = Risotto.models.user;
var Project = Risotto.models.project;
var ProjectMember = Risotto.models.projectMember;

module.exports = Risotto.Controller.extend({
	beforeFilter : {
		'user' : 'show',
		'authorize' : ['edit', 'delete', 'membershipCreate', 'membershipDelete' ], 
	},

	show: function*(params){
		if(!params.id){
			return yield this.render('error');
		}

		var project = yield Project.findOne({id: params.id})
						.populate('shots')
						.populate('member')
						.populate('owner')
		if(!project){
			return yield this.render('error');
		}

		return yield this.render('project/show', {
			project: project,
			user: this.user
		})
	},

	showEdit: function*(params){
		if(!params.id){
			return yield this.render('error');
		}

		var project = yield Project.findOne({id: params.id})
					.populate('shots')
					.populate('member')
					.populate('owner')

		if(!project || project.owner.id !== this.user.id){
			return yield this.render('error', {
				error: 'Du darfst dieses Projekt nicht bearbeiten'
			});
		}

		return yield this.render('project/edit',{
			project: project,
			user: this.user
		})
	},

	create: function*(params){

	},

	edit: function*(params){

	},

	'delete' : function*(params){

	},

	createMember: function*(params){

	},

	editMember: function*(params){
 	
	},

	/** private */
	isMember: function(){

	}
})