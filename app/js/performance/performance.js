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

	.controller("PerformanceCtl", ['$scope', '$state', 'gameService', PerformanceCtl])

	.run(function (gameService) {
		window.console.log(gameService);
	})

	function PerformanceCtl ($scope, $state, gameService) {
		var vm = this;

		vm.gameService = gameService;
	}

}());