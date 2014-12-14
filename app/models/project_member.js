var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'project_member',
  schema: true,
  connection: 'mysql',
  attributes:{
    project:{
      model: 'project'
    },

    user:{
      model: 'user'
    },

    accepted:{
      type: 'boolean',
      required: true
    },

    rejected:{
      type: 'boolean',
      required: true
    },

    deleted:{
      type: 'boolean',
      required: true
    }
  }
});