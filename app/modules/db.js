exports.initialize = function( time ){
  return function(fn){
  	setTimeout(function(){
  		fn(null);;
  	}, time);
  }	
};