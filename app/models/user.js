var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  tableName: 'user',
  schema: true,
  connection: 'mysql',
  attributes:{
    firstName:{
      type: 'string',
      required: true
    },

    lastName:{
      type: 'string',
      required: true,
      maxLength: 20
    },

    email:{
      type: 'email',
      required: true
    },

    password:{
      type: 'string',
      required: true
    },

    signInCount:{
      type: 'integer',
      required: false
    },

    confirmationToken:{
      type: 'string',
      required: false
    },

    confirmedAt:{
      type: 'date',
      required: false
    },

    profilePicture:{
      model: 'image'
    },

    projects:{
      collection: 'project',
      via: 'owner'
    },

    likes:{
      collection: 'like',
      via: 'user'
    },

    comments:{
      collection: 'comment',
      via: 'user'
    },

    shots:{
      collection:'shot',
      via: 'owner'
    },

    role:{
      model: 'user_role'
    }
  }
});