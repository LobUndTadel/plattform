module.exports = Risotto.Controller.extend({
	show: function*(){
		this.koaContext.body = 'hello';
	}
})