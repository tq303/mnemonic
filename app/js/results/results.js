(function () {
	'use strict';

	angular.module("App.Results", [])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('results', {
						controller: 'ResultsCtl',
						url: '/results',
						templateUrl: './views/results/index.html',
					})

			}
		]
	)

	.controller('ResultsCtl', ['$scope', '$state', ResultsCtl ] )

	function ResultsCtl () {

	}

}());