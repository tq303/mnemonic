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

	.controller('ResultsCtl', [ '$state', '$filter', 'GameService', 'Attempt', 'ngTableParams', ResultsCtl ] )

	function ResultsCtl($state, $filter, GameService, Attempt, ngTableParams) {
		var vm = this;

		vm.participants = [];

		vm.calcAccuracy = GameService.calcAccuracy;
		vm.calcTiming   = GameService.calcTiming;
		vm.calcScore    = GameService.calcScore;

		Attempt.find(
			function (records) {
				// update records with calculated values
				vm.participants = records.map(function (record) {
					record.accuracy = vm.calcAccuracy( record );
					record.timing   = vm.calcTiming( record );
					record.score    = vm.calcScore( record );
					return record;
				});
				setupTableParams();
			},
			function (error) {
				window.alert('there was an error.');
			}
		);

		function setupTableParams() {

			vm.tableParams = new ngTableParams({
				page: 1,
				count: 10,
				sorting: {
					name: 'desc'
				}
			}, {
				total: vm.participants.length,
				getData: function($defer, params) {
					var orderedData = params.sorting() ?
							$filter('orderBy')(vm.participants, params.orderBy()) :
							vm.participants;

					window.console.log(vm.participants.length);

					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		}

	}

}());