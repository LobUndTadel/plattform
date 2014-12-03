var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'tag',
  schema: true,
  connection: 'mysql',
  attributes:{
    name:{
      type: 'string',
      required: true
    },

    createdBy:{
      model: 'user'
    }
  }
});