var AWS = require('aws-sdk');

exports.initialize = function*(){
	var config = Risotto.config.AWS;
	config.logger = process.stdout;
	AWS.config.update(config);
	
	//expose aws
	Risotto.S3 = new AWS.S3();
};