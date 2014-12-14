var Waterline = require('waterline');
var months = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'June', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

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
      type: 'text',
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

    type:{
      type: 'string',
      required: true
    },

    ref:{
      type: 'string'
    },

    ref2:{
      type: 'string'
    },

    likes:{
      collection: 'like',
      via: 'shot'
    },

    comments:{
      collection: 'comment',
      via: 'shot'
    },

    url: function(){
      return '/shot/' + this.id + '-' + this.titleAsUrl();
    },

    titleAsUrl: function() {
      return this.title.replace(/\s/g, '-');
    },

    formatDescription: function(){
      var paragraphs = this.description.split('\n');
      var html = [];

      paragraphs.forEach(function(p){
        html.push('<p>', p.replace('\r',''), '</p>');
      });
      
      return html.join('');
    },

    createdAtFormated: function(){
      var time = new Date(this.createdAt),
          day = time.getDate();

      return (String(day).length === 1 ? '0' + day : day )
        + ', ' + months[time.getMonth()] 
        + ' ' + time.getFullYear();
    }
  }
});