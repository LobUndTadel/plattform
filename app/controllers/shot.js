var Shot = Risotto.models.shot;
var Tag = Risotto.models.tag;
var Projects = Risotto.models.projects;
var thunkify = require('thunkify');
//var parse = require('co-busboy')
var fs = require('fs')

Shot.create = thunkify(Shot.create);

module.exports = Risotto.Controller.extend({
	beforeFilter: ['authorize', 'user'],

	createForm: function*(params){
		// renders the form
	},

	create: function*(params){
		if('1' == params.step){
			yield this.step1(params)
		} else if('2' == params.step){
			yield this.step2(params);
		}
	},

	step1: function*(params){
		if(!params.files || !params.title || !params.description || !params.checkbox || params.checkbox != 'on'){
			return yield this.render('shot/createForm', {error: 'Bitte alle Felder ausfüllen'});
		}

		var image = params.files[0];
		var values = params.take('title', 'description');
		values.owner = this.user.id

		try{
			var shot = yield Shot.create(values);
		} catch(err){
			return yield this.render('shot/createForm', {error: err});
		}

		var tags = yield Tag.find()
		var projects = []
		tags = tags.map(function(t){ return t.name })

		yield this.render('shot/createForm2', {
			projects: projects,
			tags: tags,
			shot_id: shot.id
		})
	},

	step2: function*(params){
		if(!params.shot_id){
			return yield this.render('error');
		}
		
		var shot = yield Shot.findOne({id: params.shot_id});
	
		if(params.tags){
			shot.tags = String(params.tags).split(',')
		}

		if(params.project){
			shot.project = parseInt(params.project)
		}

		//try{
			yield shot.save();
		/*} catch(err){
			var tags = yield Tag.find()
			var projects = []
			tags = tags.map(function(t){ return t.name })

			return yield this.render('shot/createForm2', {
				projects: projects,
				tags: tags,
				shot_id: shot.id,
				error: err
			})
		}*/

		yield this.redirect('/');
	},

	edit: function*(params){

	},

	show: function*(params){
		if(!params.id){ 
			return yield this.render('error');
		}

		var shot = yield Shot.findOne({id: params.id})
						.populate('owner')
						.populate('project')
						.populate('comments')
						.populate('likes')

		yield this.render('shot/show', {
			shot: shot,
			user: this.user
		})
	}
})