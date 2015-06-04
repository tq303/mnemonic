(function () {
	'use strict';

	angular.module("App.Performance", [])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('performance', {
						controller: 'PerformanceCtl',
						url: '/performance',
						templateUrl: './views/performance/index.html',
					})

			}
		]
	)

	.controller("PerformanceCtl", ['$scope', '$state', 'gameService', PerformanceCtl]);

	function PerformanceCtl ($scope, $state, gameService) {

	}

}());