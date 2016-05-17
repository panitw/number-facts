function GameEngine() {
	
	var TIME_LIMIT = 120;
	var QUIZ_LIMIT = 3;
	var timer = 0;
	var intervalId = null;

	var quiz = [];
	var quizPointer = 0;
	var inputCache = "";
	var score = 0;

	var quizCollection = [
		[[4,3], [5,3], [3,3], [5,4], [6,3], [5,5], [6,4], [7,3], [4,4]],
		[[6,5], [7,7], [6,6], [7,4], [9,9], [8,8], [7,5], [8,4], [9,3], [8,3]],
		[[9,7], [8,6], [7,6], [9,5], [9,6], [9,4], [8,4], [8,7], [9,8], [8,5]]
	]

	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getTimeString(totalSec) {
		var minute = Math.floor(totalSec / 60);
		var sec = totalSec % 60;
		if (sec < 10) {
			sec = "0" + sec;
		}
		return minute + ":" + sec;
	}

	this.startTimer = function () {
		if (intervalId) {
			clearInterval(intervalId);
		}
		timer = TIME_LIMIT;
		intervalId = setInterval(function () {
			if (timer > 0) {
				timer--;
	
				var timeString = getTimeString(timer);
				$(this).trigger("timerTick", {
					time: timeString
				});
			} else {
				clearInterval(intervalId);
				intervalId = null;
				$(this).trigger("timesUp", this.calculateResult());
			}
		}.bind(this), 1000);
	}

	this.calculateResult = function () {
		return {
			score: score,
			timeLeft: getTimeString(timer)
		};
	}

	this.generateQuiz = function (level) {
		var quizCache = [];
		var quizOutput = [];
		while (quizCache.length < QUIZ_LIMIT) {
			var quizLevel = getRandomInt(0, level - 1);
			var quizLevel = getRandomInt(0, level - 1);
			var addOrSub = getRandomInt(0, 1);
			var leftOrRight = getRandomInt(0, 1);

			var quizSet = quizCollection[quizLevel];
			var quizIndex = getRandomInt(0, quizSet.length - 1);
			var selectedQuiz = quizSet[quizIndex];
			var topVal = selectedQuiz[0] + selectedQuiz[1];			
			var leftOp = null;
			var rightOp = null;
			var opr = null;
			if (addOrSub === 0) {
				if (leftOrRight === 0) {
					leftOp = selectedQuiz[0];
					rightOp = selectedQuiz[1];
				} else {
					leftOp = selectedQuiz[1];
					rightOp = selectedQuiz[0];
				}
				opr = "+";
			} else {
				leftOp = topVal;
				if (leftOrRight === 0) {
					rightOp = selectedQuiz[0];
				} else {
					rightOp = selectedQuiz[1];
				}
				opr = "-";
			}
			var expression = leftOp + opr + rightOp;
			if (quizCache.indexOf(expression) === -1) {
				quizCache.push(expression);
				quizOutput.push({
					left: leftOp,
					opr: opr,
					right: rightOp
				});
			} 
		}
		return quizOutput;
	}

	this.checkCurrentQuiz = function () {
		if (inputCache !== "") {
			var inputInt = parseInt(inputCache);
			var currentQuiz = quiz[quizPointer];
			var result = null;
			inputCache = "";
			if (currentQuiz.opr == "+") {
				result = currentQuiz.left + currentQuiz.right;
			} else {
				result = currentQuiz.left - currentQuiz.right;				
			}
			if (result === inputInt) {
				score++;
			}
			quizPointer++;
			if (quizPointer >= quiz.length) {
				$(this).trigger("endOfQuiz");
			} else {
				$(this).trigger("nextQuiz", quiz[quizPointer]);
				$(this).trigger("inputUpdated", {
					input: ""
				});
			}
		}
	}

	this.inputEnter = function (input) {
		if (input === "OK") {
			this.checkCurrentQuiz();
		} else 
		if (input === "DEL") {
			if (inputCache.length > 0) {
				inputCache = inputCache.substring(0, inputCache.length - 1);
				$(this).trigger("inputUpdated", {
					input: inputCache
				});
			}
		} else {
			if (inputCache.length < 3) {
				inputCache += input;
				$(this).trigger("inputUpdated", {
					input: inputCache
				});
			}
		}
	}

	this.start = function() {
		quiz = this.generateQuiz(3);
		quizPointer = 0;
		score = 0;
		timer = TIME_LIMIT;
		this.startTimer();
		$(this).trigger("ready");
		$(this).trigger("inputUpdated", {
			input: ""
		});
		$(this).trigger("nextQuiz", quiz[0]);
	}
}