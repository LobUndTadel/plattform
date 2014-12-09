var Shot = Risotto.models.shot;
var Tag = Risotto.models.tag;
var Projects = Risotto.models.projects;
var Comment = Risotto.models.comment;
var User = Risotto.models.user;
var thunkify = require('thunkify');
//var parse = require('co-busboy')
var fs = require('fs');
var _ = require('underscore');
var request = require('co-request');

Shot.create = thunkify(Shot.create);
Comment.create = thunkify(Comment.create);

module.exports = Risotto.Controller.extend({
	beforeFilter: {
		'authorize': ['createForm', 'create', 'edit', 'comment', 'like'],
		'user' : '*'
	},

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
		if(!params.title || !params.description || !params.checkbox || params.checkbox != 'on' || !params.type){
			return yield this.render('shot/createForm', {error: 'Bitte alle Felder ausfüllen'});
		}

		var image = params.files[0];
		var values = params.take('title', 'description');
		var videoType = this.getType(params.ref);

		if(!videoType){
			return yield this.render('shot/createForm', {error: 'Keine valide Youtube oder Vimeo Url'});
		}

		if('vimeo' === videoType.type){
			var r = yield request('http://vimeo.com/api/v2/video/' + videoType.ref + '.json');
			values.ref2 = JSON.parse(r.body)[0].thumbnail_medium
		}

		values.owner = this.user.id
		values.type = videoType.type
		values.ref = videoType.ref

		console.log('TODO: sanitizie');
		
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
		var shot = yield Shot.findOne({id: params.id})
						.populate('owner')
						.populate('project')
						.populate('comments')
						.populate('likes')
		
		var commentUsers = _.pluck(shot.comments, 'user');
		commentUsers = _.unique(commentUsers);

		commentUsers = yield User.find(commentUsers);
		var indexedUsers = {}

		commentUsers.forEach(function(user){
			indexedUsers[user.id] = user
		})

		yield this.render('shot/show', {
			shot: shot,
			user: this.user,
			url: this.request.url,
			indexedUsers: indexedUsers
		})
	},

	comment: function*(params){
		if(!params.text || !params.id){
			return this.redirect(this.shot());
		}

		console.log('TODO: sanitizie');

		var c = yield Comment.create({
			text: params.text,
			shot: params.id,
			user: this.user
		})

		yield c.save();
		this.redirect(this.shot() + '#shot-comment-' + c.id);
	},

	like: function*(params){
		
	},

	/** private methods */
	shot: function(){
		return this.request.url.replace('/comment', '');
	},

	getType: function(url){
		var match = url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);

		if(match){
			return {
				type: 'youtube',
				ref: match[1]
			}
		}

		match = url.match(/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);

		if(match){
			return {
				type: 'vimeo',
				ref: match[3]
			}
		}

		return false;
	}
})