'use strict'

var x =0;
var y =0;
var answer = 0;
var questionCount;
var questionsCorrect;
var firstAttempt = true;
const playSounds = true;
const max_questions = 10;
const auFart = new Audio('audio/fartToot.mp3');
const auCorrectCymbal = new Audio('audio/correctCymbal.mp3');
const auCheer = new Audio('audio/crowd.mp3');

const positiveMessages = [
"Yes. Keep going!",
"That's right.  You are amazing!",
"Yes. Well done.",
"Well done! You're good at this.",
"That's amazing!",
"You're kicking backside!",
];

window.onload=newGame();

function newGame(){
	questionCount = 0;
	questionsCorrect = 0;
	document.getElementById('newQuestion').style.display = 'initial';
	document.getElementById('newGame').style.display = 'none';
	document.getElementById('gameOver').innerHTML = "&nbsp;"; 
	
	// Reset progress bar
	Array.from(document.getElementById("progressBar").children).forEach(item => {item.className="progressNeutral";});

	newQuestion();
}

function finishGame(){
	
	var finishMessage = "Game Complete. ";
	if(questionsCorrect < 4){
		finishMessage += `You got ${questionsCorrect} correct on the first try.  Keep at it!`;
	}else if(questionsCorrect < 10){
		finishMessage += `You got ${questionsCorrect} correct on the first try.  Well done!`;
	}else{
		finishMessage += `You got all ${questionsCorrect} correct on the first try.  Legendary!!!`;
		setTimeout(()=> {auCheer.play();},500);
	}
	document.getElementById('newQuestion').style.display = 'none';
	document.getElementById('newGame').style.display = 'initial';
	document.getElementById('gameOver').innerHTML = finishMessage; 
}

function newQuestion(){
	x = Math.ceil(Math.random()*10);
	y =	Math.ceil(Math.random()*10);
	answer = (x * y).toString();

	// Question shown to victim
	document.getElementById('question').innerHTML = `${x} X ${y} =`; 
	
	const solutions = [];	
	// Make sure at least one of the solutions is the actual answer
	// The array will be sorted 'randomly' afterwards
	solutions[0] = answer;
	
	for(let i = 1; i < 3; i++){
		while(1){
			// Create a new random number that doesn't already exist in the list
			let nextAnswer = Math.ceil(Math.random()*10) * Math.ceil(Math.random()*10);
			if(!solutions.includes(nextAnswer)){
				solutions[i] = nextAnswer;
				break;
			}
		}
	}
	// sort the array randomly so the correct solution isnt always first
	solutions.sort(function(a, b){return 0.5 - Math.random()});
	
	document.getElementById('option1').value = solutions[0].toString();
	document.getElementById('option1').innerHTML = solutions[0].toString();
	document.getElementById('option2').value = solutions[1].toString();
	document.getElementById('option2').innerHTML = solutions[1].toString();
	document.getElementById('option3').value = solutions[2].toString();
	document.getElementById('option3').innerHTML = solutions[2].toString();
	
	document.getElementById('yourAnswerStatus').innerHTML = "&nbsp;";
	document.getElementById('newQuestion').disabled = true;
	
	document.getElementById('option1').disabled = false;
	document.getElementById('option2').disabled = false;
	document.getElementById('option3').disabled = false;
	firstAttempt = true;
	questionCount++;
}

function checkSolution(e){
	var yas = document.getElementById('yourAnswerStatus');
	if(e.value == answer){
		
		yas.setAttribute("class","correctAnswer");
		if(playSounds)auCorrectCymbal.play();
		document.getElementById('option1').disabled = true;
		document.getElementById('option2').disabled = true;
		document.getElementById('option3').disabled = true;	
		
		if(firstAttempt) {
			questionsCorrect++;
			yas.innerHTML = positiveMessages[Math.ceil(Math.random() * positiveMessages.length) - 1];
			document.getElementById(`progressBar${questionCount}`).className = "progressCorrect";
		} else {
			yas.innerHTML = "Correct";
			document.getElementById(`progressBar${questionCount}`).className = "progressStumble";
		}
		
		document.getElementById('newQuestion').disabled = false;
		
		if(questionCount == max_questions){
			finishGame();
		}
			
	}else{
		e.disabled = true;
		firstAttempt = false;
		yas.innerHTML = "Not quite! Try again";
		yas.setAttribute("class","incorrectAnswer");
		if(playSounds)auFart.play();
		document.getElementById(`progressBar${questionCount}`).className = "progressError";
	}
	 
	//document.getElementById('progress').innerHTML = 
	//console.log(`QuestionCount:${questionCount}, Correct:${questionsCorrect}`); 
	
	
}