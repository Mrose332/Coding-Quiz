var quizDocument = document.getElementById('quiz-content'); 
var initBtn = document.getElementById('init-btn'); 
var timeEl = document.getElementById('timer');

// Quiz Questions Classes
class quizQuestion {
    constructor(prompt, correctAnswer, choiceA, choiceB, choiceC, choiceD) {
        this.prompt = prompt; 
        this.correctAnswer = correctAnswer; 
        this.choiceA = choiceA; 
        this.choiceB = choiceB; 
        this.choiceC = choiceC; 
        this.choiceD = choiceD; 
        this.answerChoices = [choiceA, choiceB, choiceC, choiceD];
    }
}

//Objects related to quiz questions 
var question1 = new quizQuestion("JavaScript is a ___ -side programming language.",2,"Client","Server","Both","None"); 
var question2 = new quizQuestion("Which JavaScript label catches all the values, except for the ones specified?", 3, "Catch","Label","Try","Default"); 
var question3 = new quizQuestion("Inside which HTML element do we put the JavaScript?",3,"<Scripting>","<Javascript>","<Js>","<Script>");
var question4 = new quizQuestion("What denotes an array?",2,"{}","||","[]","()");
var question5 = new quizQuestion("How can you detect the client's browser name?",1,"client.navName","navigator.appName","browsername","Name.name");

var questionsAnswered = 0; 
var finalScore; 

//Function to randomize quiz order. 
function randomizeQuiz(fullQuiz) {
    var randQuiz = fullQuiz.sort(() => Math.random()-0.5);
    console.log("Randomized Quiz: ");
    console.log(randQuiz);
    return(randQuiz); 
} 

var fullQuiz = [question1, question2, question3, question4, question5];
var randQuiz = randomizeQuiz(fullQuiz); 


initBtn.addEventListener("click", function() {
    setTimer();
    buildQuizElements(questionsAnswered);
})


function buildQuizElements(questionsAnswered) {
    quizDocument.innerHTML = null;
    var promptHeader = document.createElement("h2");
    var answerChoicesUl = document.createElement("ul");
    answerChoicesUl.id = 'answer-choices';
    promptHeader.textContent = randQuiz[questionsAnswered].prompt;

    quizDocument.appendChild(promptHeader); 
    quizDocument.appendChild(answerChoicesUl);

    //Create answer choices
    for(i=0; i < randQuiz[questionsAnswered].answerChoices.length; i++) {
        var answerChoice = document.createElement("li");
        var answerButton = document.createElement("button");
        answerButton.textContent = randQuiz[questionsAnswered].answerChoices[i]; 
        answerButton.setAttribute('id', i);
        answerButton.setAttribute('onClick','checkAnswer(this.id)');
        answerChoice.style.listStyle = 'none';
        answerChoice.appendChild(answerButton); 
        quizDocument.appendChild(answerChoice);
    }
}

var secondsLeft = 60; 
//  Begin timer countdown 
function setTimer(){
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = "Timer: " + secondsLeft;

        if(-secondsLeft === 0) {
          clearInterval(timerInterval);
          endGame();
        }
        if(questionsAnswered === 5) {
            clearInterval(timerInterval);
        }
      }, 1000);

}

function checkAnswer(buttonId) {
    var feedbackEl = document.createElement("p"); 
   
    
    //Checks for right answer and gives feedback
    if(buttonId == randQuiz[questionsAnswered].correctAnswer) {
        console.log("Correct!");
        feedbackEl.textContent = "Correct!";
    } else {
        console.log("Incorrect.");
        secondsLeft -= penalty; 
        feedbackEl.textContent = "Incorrect."; 
    }

    
    questionsAnswered++;
    if(questionsAnswered < randQuiz.length){
        buildQuizElements(questionsAnswered); 
        quizDocument.appendChild(feedbackEl);
    } else if (questionsAnswered == randQuiz.length){
        endGame();
    }
}

//  Quiz Results
function endGame() {
    finalScore = secondsLeft; 
    timeEl.textContent = "Final Score: " + finalScore; 
    console.log(finalScore); 

    
    quizDocument.innerHTML = null; 
    var namePromptEl = document.createElement("h2"); 
    var nameEnteredEl = document.createElement("input");
    var nameButtonEl = document.createElement("button"); 

    
    namePromptEl.textContent = "Please enter your name:";
    nameEnteredEl.type = "text";
    nameEnteredEl.id = "name-entered";
    nameButtonEl.id = "name-btn";
    nameButtonEl.textContent = "Submit Score";
    nameButtonEl.setAttribute("onclick","checkHighScore(finalScore, document.querySelector('#name-entered').value)");

    //Append score submission 
    quizDocument.appendChild(namePromptEl);
    quizDocument.appendChild(nameEnteredEl);
    quizDocument.appendChild(nameButtonEl);
}

function checkHighScore(timeScore, name) {
    var highScores = JSON.parse(localStorage.getItem('highScores') || '[]');

    if(name === "") {
        name = "Anonymous";
    }
    var userScore = [timeScore, name];

    highScores.push(userScore); 
    highScores.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    if(highScores.length > 10){
        highScores.length = 10;
    } 
    localStorage.setItem("highScores",JSON.stringify(highScores));
    displayScoreboard();
}

function displayScoreboard() {
    quizDocument.innerHTML = null;
    var scoreboardEl = document.createElement("ol");
    var returnBtnEl = document.createElement("button"); 
    returnBtnEl.textContent = 'Return to Game';
    returnBtnEl.setAttribute("onclick","location.reload()");

    var highScores = JSON.parse(localStorage.getItem('highScores'));
    for(var i=0; i < highScores.length; i++) {
        var highScoreEl = document.createElement("li");
        highScoreEl.textContent = "Score: " + highScores[i][0] + "  " + highScores[i][1];
        scoreboardEl.append(highScoreEl);
    }
    quizDocument.appendChild(scoreboardEl);
    quizDocument.appendChild(returnBtnEl);
}