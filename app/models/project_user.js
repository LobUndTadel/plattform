var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'project_user',
  schema: true,
  connection: 'mysql',
  attributes:{
    project:{
      model: 'project'
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