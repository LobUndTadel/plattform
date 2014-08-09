module.exports = {
	http : {
		port : 8081,
		respondWith : 'html',
		statics : 'app/public/',
		session : {
			secret : ''
		},
		logger : 'HTTP :remote-addr :method :url :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
	},

	redis : {

	},

	database : {
		name : 'lob&tadel',
	},

	logger : {
		levels : {
			console : 0,
			file : 3
		}
	}
};
