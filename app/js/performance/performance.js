(function () {
	'use strict';

	angular.module("App.Performance", [])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('performance', {
						controller: 'PerformanceCtl as performance',
						url: '/performance',
						templateUrl: './views/performance/index.html',
					})

			}
		]
	)

	.controller("PerformanceCtl", [ '$state', 'GameService', 'Attempt', PerformanceCtl ])

	function PerformanceCtl ($state, GameService, Attempt) {
		var vm = this;

		// variables
		vm.blocks  		   = GameService.blocks;
		vm.attemptPosition = GameService.attemptPosition;
		vm.username 	   = '';
		vm.showError	   = false;

		// functions
		vm.attempt 		     = GameService.attempt;
		vm.isStandBy 	     = GameService.isStandBy;
		vm.startGame	     = GameService.startGame;
		vm.isPlaying 	     = GameService.isPlaying;
		vm.isYourTurn 	     = GameService.isYourTurn;
		vm.isPerforming      = GameService.isPerforming;
		vm.attemptProgress   = GameService.attemptProgress;
		vm.isComplete 	     = GameService.isComplete;
		vm.getAccuracy 	     = GameService.getAccuracy;
		vm.getTiming 	     = GameService.getTiming;
		vm.getScore 	     = GameService.getScore;
		vm.resetState 	     = GameService.resetState;
		vm.remainingAttempts = GameService.remainingAttempts;

		// performance
		vm.currentTest = GameService.currentTest;
		vm.currentPerf = GameService.currentPerf;

		vm.savePerformance = savePerformance;

		function savePerformance(isValid) {
			if (isValid) {

				Attempt.create({
						name 	: vm.username,
						test 	: vm.currentTest,
						attempt : vm.currentPerf,
						date 	: new Date()
					},
					function (record) {
						window.console.log('record', record);
						vm.resetState();
					},
					function (error) {
						window.console.log('error', error);
					}
				);

			} else {
				vm.showError = true;
			}
		}

	}

}());