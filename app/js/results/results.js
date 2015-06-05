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
		vm.sortOptions  = [
			{ id: 'accuracy', label: 'Accuracy' },
			{ id: 'timing',   label: 'Timing' },
			{ id: 'total', 	  label: 'Total' }
		];
		vm.sortType 	= vm.sortOptions[0].name;

		vm.orderParticipants = orderParticipants;

		vm.calcAccuracy = GameService.calcAccuracy;
		vm.calcTiming   = GameService.calcTiming;
		vm.calcScore    = GameService.calcScore;

		vm.sortByAccuracy = sortByAccuracy;
		vm.sortByTiming   = sortByTiming;
		vm.sortByScore    = sortByScore;

		function orderParticipants() {
			return vm.participants.sort(function (a, b) {
				return vm.sortByScore(a, b);
				switch (vm.sortType) {
					case 'accuracy':
						return vm.sortByAccuracy(a, b);
					case 'timing':
						// return vm.sortByTiming(a, b);
						return 0;
					case 'total':
						return vm.sortByScore(a, b);
				}
			});
		}

		function sortByAccuracy(a, b) {
			if (vm.calcAccuracy(a) < vm.calcAccuracy(b))
				return -1;
			if (vm.calcAccuracy(a) > vm.calcAccuracy(b))
				return 1;
			return 0;
		}

		function sortByTiming(a, b) {
			if (vm.calcTiming(a) < vm.calcTiming(b))
				return -1;
			if (vm.calcTiming(a) > vm.calcTiming(b))
				return 1;
			return 0;
		}

		function sortByScore(a, b) {
			if (vm.calcScore(a) < vm.calcScore(b))
				return -1;
			if (vm.calcScore(a) > vm.calcScore(b))
				return 1;
			return 0;
		}

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