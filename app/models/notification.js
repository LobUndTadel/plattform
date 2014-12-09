var Waterline = require('waterline');
var marked = require('marked');

module.exports = Waterline.Collection.extend({
  tableName: 'notification',
  schema: true,
  connection: 'mysql',
  attributes:{
    model:{
      type: 'string',
      required: true
    },
    action:{
      type: 'string',
      required: true
    },
    ref:{
      type: 'integer',
      required: true
    },
    ref2:{
      type: 'integer',
      required: false
    },
    actor:{
      model: 'user',
      required: true
    },
    seen:{
      type: 'boolean',
      defaultsTo: false
    }
  }
});
/*
shot, like, shot_id, user_id
shot, comment, shot_id, user_id
shot, mentioned, shot_id, comment_id, user_id
project, created, project_id, user_id
project, joined, project_id, user_id
*/