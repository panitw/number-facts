$(function () {

	//Game Engine
	var engine = new GameEngine();

	$("#startButton").click(function () {
		$("#introPage").fadeOut(500, function () {
			$("#gamePage #question").hide();
			$("#gamePage").show(function () {
				engine.start();
			});
		});
	});

	$("#reStartButton").click(function () {
		$("#resultPage").fadeOut(500, function () {
			$("#gamePage #question").hide();
			$("#gamePage").show(function () {
				engine.start();
			});
		});
	});

	$(".numberKey").on("touchstart", function () {
						$(this).addClass("button-pressed");
					})
				   .on("touchend", function () {
						$(this).removeClass("button-pressed");				   	
				   });

	$(".numberKey").on("mousedown", function () {
						$(this).addClass("button-pressed");
						var val = $(this).attr("key");
						engine.inputEnter(val);
					})
				   .on("mouseup", function () {
						$(this).removeClass("button-pressed");				   	
				    });
	
	$(engine).on("ready", function (e) {
		$("#introPage").fadeOut(500, function () {
			$("#gamePage").show();
		});
	});

	$(engine).on("timerTick", function (e, data) {
		$("#gamePage .timer .time").text(data.time);		
	});

	$(engine).on("inputUpdated", function (e, data) {
		var input = data.input;
		for (var i=data.input.length;i<2;i++) {
			input += "&nbsp;";
		}
		$("#gamePage #ans").html(input);
	});

	function displayResult() {
		var result = engine.calculateResult();
		$("#resultPage #score").html(result.score + " / 30");
		$("#resultPage #timeLeft").html(result.timeLeft);
		$("#gamePage").fadeOut(1000, function () {
			$("#resultPage").fadeIn(1000);
		});
	}

	$(engine).on("timesUp", function (e) {
		displayResult();
	});

	$(engine).on("endOfQuiz", function (e) {
		displayResult();
	});

	$(engine).on("nextQuiz", function (e, data) {
		$("#gamePage #question").show();
		$("#gamePage #p1").text(data.left);
		$("#gamePage #op").text(data.opr);
		$("#gamePage #p2").text(data.right);
	});

	$(document).on('touchmove', function(e) {
        e.preventDefault();
	}, false);

});