(function () {
    'use strict';

	angular.module("App", [
		'ui.router',
		'App.Performance',
		'App.Results',
		'lbServices',
		'ngTable'
	])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('index', {
						controller: 'IndexCtl as index',
						url: '/',
						templateUrl: './views/index/index.html',
						data: {
							name: 'index'
						}
					})
			}
		]
	)

	.controller('IndexCtl', [ '$state', IndexCtl ] )

 	function IndexCtl ($state) {}
	
}());
