var _ = require("underscore");

function Params() {}

Params.prototype.set = function(obj) {
	for (var key in obj) {
		this[key] = _.clone(obj[key]);
	}
};

Params.prototype.take = function(/** args */){
	var taken = {};

	[].forEach.call(arguments, function(key){
		taken[key] = _.clone(this[key]);
	}, this);

	return taken;
};

module.exports = Params;