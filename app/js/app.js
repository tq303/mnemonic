(function () {
    'use strict';

	angular.module("App", [
		'ui.router',
		'App.Performance',
		'App.Results',
		'lbServices'
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

	.factory('GameService', [ '$timeout', '$interval', GameService ])
 	
 	function IndexCtl ($state) {}

 	function GameService ($timeout, $interval) {
		var blocks 		       = [],
			isCurrentlyPlaying =  false,
			hasPlayed          =  false,
			attempting         =  false,
			hasAttempted	   =  false,
			timer      	       =  600,
			currentTest        =  [],
			attemptPosition    =  0,
			attemptProgress    =  0,
			currentPerf	       =  [],
			attemptTimer       =  0;

		resetBlocks();

		return {
			// variables
			blocks 		       : blocks,
			isCurrentlyPlaying : isCurrentlyPlaying,
			hasPlayed          : hasPlayed,
			attempting         : attempting,
			hasAttempted	   : hasAttempted,
			timer      	       : timer,
			currentTest        : currentTest,
			attemptPosition    : attemptPosition,
			attemptProgress    : attemptProgress,
			currentPerf	       : currentPerf,
			attemptTimer       : attemptTimer,
			// functions
			startGame		  : startGame,
			attempt		 	  : attempt,
			isStandBy		  : isStandBy,
			isPlaying		  : isPlaying,
			isYourTurn		  : isYourTurn,
			isPerforming	  : isPerforming,
			isComplete		  : isComplete,
			getAccuracy		  : getAccuracy,
			getTiming		  : getTiming,
			getScore		  : getScore,
			resetState		  : resetState,
			remainingAttempts : remainingAttempts,
		}

		function resetBlocks() {
			blocks 	    	= [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }],
			currentTest 	= [],
			currentPerf 	= [],
			attemptPosition =  0,
			attemptProgress =  0,
			attemptTimer    =  0;
		}

		// function definitions
		function startGame() {
			var i = 0,
				totalCount = blocks.length,
				getNext = function () {
					$timeout(function () {
						// randomly set block
						var rand = (Math.floor(Math.random() * 8));
						blocks[rand].active = true;
						currentTest.push({
							'block':  rand,
							'timing': timer
						});

						// remove set block
						$timeout(function () {
							blocks[rand].active = false;
						}, (timer / 2));

						i++;

						checkGetNext();
					}, timer);
				},
				checkGetNext = function () {
					if (i < totalCount && isCurrentlyPlaying)
						getNext();
					else {
						isCurrentlyPlaying = false;
						hasPlayed = true;
					}
				};

			for (var j in blocks)
				blocks[j].active = false;

			isCurrentlyPlaying = true;
			getNext();
		}

		function attempt(bIndex) {

			if (!hasPlayed || hasAttempted)
				return;
			else {
				if (!attempting)
					attempting = true;
			}

			// use previous timing
			currentPerf.push({
				'block':  bIndex,
				'timing': attemptProgress
			});

			// cancel previous interval
			$interval.cancel(attemptTimer);
			attemptProgress = 0;

			// update progress-bar
			attemptTimer = $interval(function () {
				attemptProgress++;
				// clear interval if reaches global timer
				if (attemptProgress >= timer) {
					attemptProgress = timer;
					$interval.cancel(attemptTimer);	
				}

			}, 1);

			if (attemptPosition < (currentTest.length - 1))
				attemptPosition++;
			else {
				attempting = false;
				hasAttempted = true;
			}
		}

		// score output
		function getAccuracy() {
			var isMatch = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.block === currentTest[key].block)
					isMatch++;
			});

			return Math.floor((100 / currentTest.length) * isMatch);
		}

		function getTiming() {
			var isInTime = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.timing < 100)
					isInTime++;
			});

			return Math.floor((100 / currentTest.length) * isInTime);
		}

		function getScore() {
			return ((getAccuracy() + getTiming()) / 2);
		}

		function remainingAttempts() {
			return currentTest.length - attemptPosition;
		}

		// control states
		function isStandBy() {
			return !isCurrentlyPlaying && !attempting && !hasPlayed && !hasAttempted;
		}

		function isPlaying() {
			return isCurrentlyPlaying && !attempting && !hasPlayed && !hasAttempted;
		}

		function isYourTurn() {
			return !isCurrentlyPlaying && !attempting && hasPlayed && !hasAttempted;
		}

		function isPerforming() {
			return !isCurrentlyPlaying && attempting && hasPlayed && !hasAttempted;
		}

		function isComplete() {
			return !isCurrentlyPlaying && !attempting && hasPlayed && hasAttempted;
		}

		function resetState() {
			resetBlocks();
			isCurrentlyPlaying = false;
			attempting   = false;
			hasPlayed    = false;
			hasAttempted = false;
		}
	};

}());
