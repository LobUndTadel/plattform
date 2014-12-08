var Waterline = require('waterline');
var months = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'June', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
var marked = require('marked');

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

    likes:{
      collection: 'like',
      via: 'shot'
    },

    comments:{
      collection: 'comment',
      via: 'shot'
    },

    titleAsUrl: function() {
      return this.title.replace(/\s/g, '-');
    },

    createdAtFormated: function(){
      var time = new Date(this.createdAt),
          day = time.getDate();

      return (String(day).length === 1 ? '0' + day : day )
        + ', ' + months[time.getMonth()] 
        + ' ' + time.getFullYear();
    },

    descriptionAsMarkdown: function(){
      return marked(this.description);
    }
  }
});