var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'shot',
  schema: true,
  connection: 'mysql',
  attributes: {
    name:{
      type: 'string',
      required: true
    },

    description:{
      type: 'string',
      required: true,
    },

    tags:{
      type: 'string',
      required: false
    },

    project:{
      model: 'project'
    },

    owner:{
      model: 'user'
    }
  }
});