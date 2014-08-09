Risotto.before('controller', function*(next){
	console.log('hooked');
	yield next;
});