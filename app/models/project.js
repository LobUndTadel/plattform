var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'project',
  schema: true,
  connection: 'mysql',
  attributes: {
    name:{
      type: 'string'
    },

    owner:{
      model: 'user'
    },

    member:{
      collection: 'project_user',
      via: 'project'
    },

    shots:{
      collection: 'shot',
      via: 'project'
    },

    url: function() {
      return '/project/' + this.id + '-' + this.name.replace(/\s/g, '-');
    },

    toJSON: function(){
      return{
        name: this.name,
        owner: this.owner,
        createdAt: this.createdAt
      }
    }
  }
});