var Waterline = require('waterline');
var bcrypt = require('bcrypt');
var thunkify = require('thunkify');
var compare = thunkify(bcrypt.compare);


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

    username: {
      type: 'string',
      required: true
    },

    email:{
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      minLength: 6,
      required: true,
      columnName: 'encrypted_password'
    },

    signInCount:{
      type: 'integer',
      required: false,
      defaultsTo: 0
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

    projectOwner:{
      collection: 'project',
      via: 'owner'
    },

    projectMember:{
      collection: 'project_user',
      via: 'user'
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
    },

    fullName: function() {
      return this.firstName + ' ' + this.lastName
    },

    comparePassword: function*(password){
      return yield compare(password, this.password);
    },

    link: function(){
      return this.username
    },

    image: function(size){
      return "https://avatars2.githubusercontent.com/u/458714?v=3&s=40"
    }
  },

    // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return next(err);
      values.password = hash;
      next();
    });
  }
});