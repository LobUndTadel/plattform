var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'shot',
  schema: true,
  connection: 'mysql',
  attributes: {
    title:{
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
      model: 'project',
      required: false
    },

    owner:{
      model: 'user',
      required: true
    },

    image:{
      model: 'image'
    },

    titleAsUrl: function() {
      return this.title.replace(' ', '-');
    }
  }
});