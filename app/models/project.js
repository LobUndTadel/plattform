var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'project',
  schema: true,
  connection: 'mysql',
  attributes: {
    name:{
      type: 'string'
    },

    owner:{
      model: 'user'
    },

    member:{
      collection: 'project_user',
      via: 'project'
    },

    shots:{
      collection: 'shot',
      via: 'project'
    }
  }
});