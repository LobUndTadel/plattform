var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'user_role',
  schema: true,
  connection: 'mysql',
  attributes: {
    role:{
      type: 'integer'
    },

    user:{
      model: 'user'
    }
  }
});