const questions = [
    {
        question: "What is the capital of France?",
        answer: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false }
        ]
    },
    {
        question: "What is the largest planet in our solar system?",
        answer: [
            { text: "Earth", correct: false },
            { text: "Jupiter", correct: true },
            { text: "Saturn", correct: false },
            { text: "Mars", correct: false }
        ]
    },
    {
        question: "What is the chemical symbol for water?",
        answer: [
            { text: "H2O", correct: true },
            { text: "CO2", correct: false },
            { text: "O2", correct: false },
            { text: "NaCl", correct: false }
        ]
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        answer: [
            { text: "Harper Lee", correct: true },
            { text: "Mark Twain", correct: false },
            { text: "Ernest Hemingway", correct: false },
            { text: "F. Scott Fitzgerald", correct: false }
        ]
    }
]


const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("ans-btns");
const nextButtonsElement = document.getElementById("nxt-btn");

let currentQuestionIndex = 0;
let score = 0;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    totalSeconds = 60; 
    startTimer(); 
    nextButtonsElement.innerHTML = "Next";
    showQuestion();
}

let timerInterval;
let totalSeconds = 60;

function startTimer() {
    clearInterval(timerInterval); 

    updateTimer(); 
    timerInterval = setInterval(() => {
        totalSeconds--;

        updateTimer();

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById("time").innerText = `${minutes}:${seconds}`;
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answer.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.className = "bg-purple-100 text-purple-950 font-medium w-full border border-purple-950 p-[10px] my-[10px] mx-0 text-left rounded-[10px] enabled:hover:text-purple-100 enabled:hover:bg-purple-950 transition";
        answerButtonsElement.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}
function resetState(){
    nextButtonsElement.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}
function selectAnswer(e){
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    if (isCorrect) {
        selectedButton.classList.add("bg-green-300");
        score++;
    } else {
        selectedButton.classList.add("bg-red-300");
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("bg-green-300");
        } 
        button.disabled = true;
        button.classList.add("cursor-not-allowed");
    });
    
    nextButtonsElement.style.display = "block";
}


nextButtonsElement.addEventListener("click", () => {
    if (nextButtonsElement.innerText === "Play Again") {
        startGame();
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        clearInterval(timerInterval); 
        questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
        answerButtonsElement.innerHTML = "";
        nextButtonsElement.innerText = "Play Again";
        nextButtonsElement.style.display = "block";
    }
});

function endQuiz() {
    questionElement.innerHTML = `Time's up! You scored ${score} out of ${questions.length}`;
    answerButtonsElement.innerHTML = "";
    nextButtonsElement.innerText = "Play Again";
    nextButtonsElement.style.display = "block";
}

startGame();
