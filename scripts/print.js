$(function () {
	var engine = new GameEngine();
	var quizList = engine.generateQuiz(1);
	for (var i=0; i<quizList.length; i++) {
		var quiz = quizList[i];
		var el = $('<div class="question">'+
				      '<div style="display:inline-block; width: 120px"><span>'+ (i+1) +') </span><span>'+quiz.left+' '+quiz.opr+' '+quiz.right+'</span></div> <span>=</span> <span style="text-decoration: underline;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'+
				   '</div>');
		if (i < (quizList.length / 2)) {
			$('#leftCol').append(el);
		} else {
			$('#rightCol').append(el);			
		}
	}
});