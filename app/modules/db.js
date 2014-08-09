exports.initialize = function( app ){
  return function(fn){
  	setTimeout(function(){
  		fn(null);;
  	}, 100);
  }	
};