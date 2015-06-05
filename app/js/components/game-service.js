(function () {
	'use strict';

	angular.module("App")
		.factory('GameService', [ '$timeout', '$interval', GameService ])

 	function GameService ($timeout, $interval) {
		var blocks 		       = [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }],
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
			calcAccuracy	  : calcAccuracy,
			getTiming		  : getTiming,
			calcTiming		  : calcTiming,
			getScore		  : getScore,
			calcScore		  : calcScore,
			resetState		  : resetState,
			remainingAttempts : remainingAttempts,
		}

		function resetBlocks() {
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

		// score local accuracy
		function getAccuracy() {
			var isMatch = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.block === currentTest[key].block)
					isMatch++;
			});

			return Math.floor((100 / currentTest.length) * isMatch);
		}

		// score accuracy with inputs
		function calcAccuracy(result) {
			var isMatch = 0,
				i;

			angular.forEach(result.attempt, function (value, key, object) {
				if (value.block === result.test[key].block)
					isMatch++;
			});

			return Math.floor((100 / result.test.length) * isMatch);
		}

		// score local timing
		function getTiming() {
			var isInTime = 0,
				i;

			angular.forEach(currentPerf, function (value, key, object) {
				if (value.timing < timer)
					isInTime++;
			});

			return Math.floor((100 / currentTest.length) * isInTime);
		}

		// score timing with inputs
		function calcTiming(result) {
			var isInTime = 0,
				i;

			angular.forEach(result.test, function (value, key, object) {
				if (value.timing < timer)
					isInTime++;
			});

			return Math.floor((100 / result.attempt.length) * isInTime);
		}

		// total score
		function getScore() {
			return ((getAccuracy() + getTiming()) / 2);
		}

		// total score with inputs
		function calcScore(result) {
			return ((calcAccuracy(result) + calcTiming(result)) / 2);
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