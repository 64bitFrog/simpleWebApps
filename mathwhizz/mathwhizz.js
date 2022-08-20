'use strict'

var answer = 0;
var questionCount;
var questionsCorrect;
var firstAttempt = true;
const playSounds = true;
const max_questions = 10;
const auFart = new Audio('audio/fartToot.mp3');
const auCorrectCymbal = new Audio('audio/correctCymbal.mp3');
const auCheer = new Audio('audio/crowd.mp3');

// not sure if enums are a javascript thing yet - so use old-skool consts
// and pretend we can't see these values
const opMultiplication = 1;
const opDivision = 2;
const opAddition = 3;
const opSubtraction = 4;

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

function generateRandomSolution(operation){
	var solution = 0;
	switch(operation){
		case opMultiplication:
			solution = Math.ceil(Math.random()*10) * Math.ceil(Math.random()*10);
			break;
		case opDivision:
			solution = Math.ceil(Math.random()*10);
			break;
	}
	return solution;
}

function newQuestion(){
	var operandOne = Math.ceil(Math.random()*10);
	var operandTwo = Math.ceil(Math.random()*10);
	let operation = Math.ceil(Math.random()*2); // <- not best practice but will do for now
	var opSymbol = ''
	
	switch(operation){
		case opMultiplication: 
			answer = (operandOne * operandTwo).toString();
			opSymbol = 'X';	
			break;
		case opDivision: 
			// Fractions not allowed so find answer and swap with operand.
			answer = (operandOne * operandTwo);
			[answer, operandOne] = [operandOne, answer];
			answer = answer.toString();
			opSymbol = '&div;';
			break;
	}
			
	
	// Show question 
	document.getElementById('question').innerHTML = `${operandOne} ${opSymbol} ${operandTwo} =`; 
	
	const solutions = [];	
	// Make sure at least one of the solutions is the actual answer
	// The array will be sorted randomly afterwards
	solutions[0] = answer;
	
	for(let i = 1; i < 3; i++){
		while(1){
			// Create a new random answer that doesn't already exist in the list
			var nextAnswer = generateRandomSolution(operation).toString();
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
}