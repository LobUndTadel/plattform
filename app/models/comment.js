var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'comment',
  schema: true,
  connection: 'mysql',
  attributes:{
    text:{
      type: 'string'
    },
    shot:{
      model: 'shot'
    },
    user:{
      model: 'user'
    }
  }
});