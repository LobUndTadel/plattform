module.exports = Risotto.Controller.extend({
	showLogin : function*(){
		console.log('calls')
		this.koaContext.body = 'hello';
	},
	login : function*(){},
	logout : function*(){}
})