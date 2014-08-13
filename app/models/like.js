var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'like',
  schema: true,
  connection: 'mysql',
  attributes: {
    project: {
      model: 'project'
    },
    user: {
      model: 'user'
    }
  }
});