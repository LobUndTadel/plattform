var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'like',
  schema: true,
  connection: 'mysql',
  attributes:{
    shot:{
      model: 'shot'
    },

    user:{
      model: 'user'
    }
  }
});