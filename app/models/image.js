var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'image',
  schema: true,
  connection: 'mysql',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    contentType: {
      type: 'string',
      required: true
    },
    size: {
      type: 'integer',
      required: true
    }
  }
});