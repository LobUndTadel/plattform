var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'user',
  schema: true,
  connection: 'mysql',
  attributes: {
    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true,
      maxLength: 20
    },

    email: {
      type: 'email',
      required: true
    },

    age: {
      type: 'integer',
      min: 18
    },
    fullName: function() {
      return this.firstName + ' ' + this.lastName
    }
  }
});