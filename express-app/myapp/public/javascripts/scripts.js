requirejs.config({
	baseUrl: "myapp",
	paths: {
		jquery: [
			'//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
		],
		fontawesome [
			'//use.fontawesome.com/releases/v5.0.7/js/all.js'
		],
		// css [
		// 	'public/stylesheets/trello-style.css'
		// ],
		// w3css [
		// 	'//www.w3schools.com/w3css/4/w3.css'
		// ],
		bootstrapcss: [ 
			'//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
		],
		bootstrapjs: [
			'//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
		],
		auth0: [
			'//cdn.auth0.com/js/auth0/8.7/auth0.min.js'
		],
		// trellojs: [
		// 	'public/javascripts/trello.js'
		// ],
	}
});