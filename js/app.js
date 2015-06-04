/**
 * Created by oliver.white on 01/06/15.
 */
(function () {
    'use strict';

	angular.module("app", [])
		.controller("mainController", ["$timeout", "$interval", mainController]);
 	
 	function mainController ($timeout, $interval) {
		var vm = this;

		// variables
		vm.blocks 		   = [{ active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }];
		vm.isPlaying       = false;
		vm.hasPlayed       = false;
		vm.attempting      = false;
		vm.hasAttempted	   = false;
		vm.timer      	   = 600;
		vm.currentTest     = [];
		vm.attemptPosition = 0;
		vm.attemptProgress = 0;
		vm.currentPerf	   = [];

		// private variables
		var attemptTimer   = 0;

		// functions
		vm.Start       	   = Start;
		vm.Attempt         = Attempt;
		vm.IsStandBy	   = IsStandBy;
		vm.IsPlaying	   = IsPlaying;
		vm.IsYourTurn	   = IsYourTurn;
		vm.IsPerforming	   = IsPerforming;
		vm.IsComplete	   = IsComplete;
		vm.GetAccuracy	   = GetAccuracy;
		vm.GetTiming	   = GetTiming;
		vm.GetScore		   = GetScore;
		vm.ResetState	   = ResetState;

		// function definitions
		function Start() {
			var i = 0,
				totalCount = vm.blocks.length,
				GetNext = function () {
					$timeout(function () {
						// randomly set block
						var rand = (Math.floor(Math.random() * 8));
						vm.blocks[rand].active = true;
						vm.currentTest.push(rand);

						// remove set block
						$timeout(function () {
							vm.blocks[rand].active = false;
						}, (vm.timer / 2));

						i++;

						CheckGetNext();
					}, vm.timer);
				},
				CheckGetNext = function () {
					if (i < totalCount)
						GetNext();
					else {
						vm.isPlaying = false;
						vm.hasPlayed = true;
					}
				};

			for (var j in vm.blocks)
				vm.blocks[j].active = false;

			vm.isPlaying = true;
			GetNext();
		}

		function Attempt(bIndex) {

			if (!vm.hasPlayed || vm.hasAttempted)
				return;
			else {
				if (!vm.attempting)
					vm.attempting = true;
			}

			// use previous timing
			vm.currentPerf.push({
				'index':  bIndex,
				'timing': vm.attemptProgress
			});

			// cancel previous interval
			$interval.cancel(attemptTimer);
			vm.attemptProgress = 0;

			// update progress-bar
			attemptTimer = $interval(function () {
				vm.attemptProgress++;
				// clear interval if reaches 100%
				if (vm.attemptProgress >= 100) {
					vm.attemptProgress = 100;
					$interval.cancel(attemptTimer);	
				}

			}, (100 / vm.timer));

			if (vm.attemptPosition < (vm.currentTest.length - 1))
				vm.attemptPosition++;
			else {
				vm.attempting = false;
				vm.hasAttempted = true;
			}
		}

		// score output
		function GetAccuracy() {
			var isMatch = 0,
				i;

			angular.forEach(vm.currentPerf, function (value, key, object) {
				if (value.index === vm.currentTest[key])
					isMatch++;
			});

			return Math.floor((100 / vm.currentTest.length) * isMatch);
		}

		function GetTiming() {
			var isInTime = 0,
				i;

			angular.forEach(vm.currentPerf, function (value, key, object) {
				if (value.timing < 100)
					isInTime++;
			});

			return Math.floor((100 / vm.currentTest.length) * isInTime);
		}

		function GetScore() {
			return ((GetAccuracy() + GetTiming()) / 2);
		}

		// control states
		function IsStandBy() {
			return !vm.isPlaying && !vm.attempting && !vm.hasPlayed && !vm.hasAttempted;
		}

		function IsPlaying() {
			return vm.isPlaying && !vm.attempting && !vm.hasPlayed && !vm.hasAttempted;
		}

		function IsYourTurn() {
			return !vm.isPlaying && !vm.attempting && vm.hasPlayed && !vm.hasAttempted;
		}

		function IsPerforming() {
			return !vm.isPlaying && vm.attempting && vm.hasPlayed && !vm.hasAttempted;
		}

		function IsComplete() {
			return !vm.isPlaying && !vm.attempting && vm.hasPlayed && vm.hasAttempted;
		}

		function ResetState() {
			vm.isPlaying    = false;
			vm.attempting   = false;
			vm.hasPlayed    = false;
			vm.hasAttempted = false;
		}
	};

}());
