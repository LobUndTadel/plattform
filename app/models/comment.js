var Waterline = require('waterline');
var marked = require('marked');

module.exports = Waterline.Collection.extend({
  tableName: 'comment',
  schema: true,
  connection: 'mysql',
  attributes:{
    text:{
      type: 'text',
      required: true
    },
    shot:{
      model: 'shot'
    },
    user:{
      model: 'user'
    },
    textAsMarkdown: function() {
      return marked(this.text || '');
    }
  }
});