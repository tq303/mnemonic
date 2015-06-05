(function () {
	'use strict';

	angular.module("App.Results", [])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('results', {
						controller: 'ResultsCtl as results',
						url: '/results',
						templateUrl: './views/results/index.html',
					})

			}
		]
	)

	.controller('ResultsCtl', [ '$state', 'GameService', 'Attempt', ResultsCtl ] )

	function ResultsCtl($state, GameService, Attempt) {
		var vm = this;

		vm.participants = [];

		Attempt.find(
			function (records) {
				vm.participants = records;
			},
			function (error) {
				window.alert('there was an error.');
			}
		)
	}

}());