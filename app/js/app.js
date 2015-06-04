(function () {
    'use strict';

	angular.module("App", [
		'ui.router',
		'App.Performance',
		'App.Results'
	])

	.config(
		['$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {
		
				$urlRouterProvider.otherwise("/");
		
				$stateProvider

					.state('index', {
						controller: 'IndexCtl',
						url: '/',
						templateUrl: './views/index/index.html',
						data: {
							name: 'index'
						}
					})
			}
		]
	)

	.controller('IndexCtl', [ '$scope', '$state', IndexCtl ] )

	.factory('gameService', [ '$timeout', '$interval', gameService ])
 	
 	function IndexCtl ($scope, $state) {
 		
 	}

 	function gameService ($timeout, $interval) {
		// variables
		var blocks 		   = [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }],
			isPlaying       = false,
			hasPlayed       = false,
			attempting      = false,
			hasAttempted	   = false,
			timer      	   = 600,
			currentTest     = [],
			attemptPosition = 0,
			attemptProgress = 0,
			currentPerf	   = [],
			attemptTimer   = 0;

		// functions
		return {
			Start: 		  Start,
			Attempt: 	  Attempt,
			IsStandBy: 	  IsStandBy,
			IsPlaying: 	  IsPlaying,
			IsYourTurn:   IsYourTurn,
			IsPerforming: IsPerforming,
			IsComplete:   IsComplete,
			GetAccuracy:  GetAccuracy,
			GetTiming: 	  GetTiming,
			GetScore: 	  GetScore,
			ResetState:   ResetState,
		}

		// function definitions
		function Start() {
			var i = 0,
				totalCount = blocks.length,
				GetNext = function () {
					$timeout(function () {
						// randomly set block
						var rand = (Math.floor(Math.random() * 8));
						blocks[rand].active = true;
						currentTest.push(rand);

						// remove set block
						$timeout(function () {
							blocks[rand].active = false;
						}, (timer / 2));

						i++;

						CheckGetNext();
					}, timer);
				},
				CheckGetNext = function () {
					if (i < totalCount)
						GetNext();
					else {
						isPlaying = false;
						hasPlayed = true;
					}
				};

			for (var j in blocks)
				blocks[j].active = false;

			isPlaying = true;
			GetNext();
		}

		function Attempt(bIndex) {

			if (!hasPlayed || hasAttempted)
				return;
			else {
				if (!attempting)
					attempting = true;
			}

			// use previous timing
			currentPerf.push({
				'index':  bIndex,
				'timing': attemptProgress
			});

			// cancel previous interval
			$interval.cancel(attemptTimer);
			attemptProgress = 0;

			// update progress-bar
			attemptTimer = $interval(function () {
				attemptProgress++;
				// clear interval if reaches 100%
				if (attemptProgress >= 100) {
					attemptProgress = 100;
					$interval.cancel(attemptTimer);	
				}

			}, (100 / timer));

			if (attemptPosition < (currentTest.length - 1))
				attemptPosition++;
			else {
				attempting = false;
				hasAttempted = true;
			}
		}

		// score output
		function GetAccuracy() {
			var isMatch = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.index === currentTest[key])
					isMatch++;
			});

			return Math.floor((100 / currentTest.length) * isMatch);
		}

		function GetTiming() {
			var isInTime = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.timing < 100)
					isInTime++;
			});

			return Math.floor((100 / currentTest.length) * isInTime);
		}

		function GetScore() {
			return ((GetAccuracy() + GetTiming()) / 2);
		}

		// control states
		function IsStandBy() {
			return !isPlaying && !attempting && !hasPlayed && !hasAttempted;
		}

		function IsPlaying() {
			return isPlaying && !attempting && !hasPlayed && !hasAttempted;
		}

		function IsYourTurn() {
			return !isPlaying && !attempting && hasPlayed && !hasAttempted;
		}

		function IsPerforming() {
			return !isPlaying && attempting && hasPlayed && !hasAttempted;
		}

		function IsComplete() {
			return !isPlaying && !attempting && hasPlayed && hasAttempted;
		}

		function ResetState() {
			isPlaying    = false;
			attempting   = false;
			hasPlayed    = false;
			hasAttempted = false;
		}
	};

}());
