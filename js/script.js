async function loadCategories() {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();

        const select = document.getElementById('category');

        select.innerHTML = '<option value="">Any Category</option>';
        data.trivia_categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.innerText = cat.name;
        select.appendChild(opt);
        });
    } catch (error) {
        console.error('Error loading Categories', error);
    }
}
window.addEventListener('DOMContentLoaded', loadCategories);




let originalTimeInSeconds 

document.getElementById("start-btn").addEventListener("click", () => {
    const amount = document.getElementById("num").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const time = parseInt(document.getElementById("time").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid number of questions.");
        return;
    }

    if (isNaN(time) || time <= 0) {
        alert("Please enter a valid time in seconds.");
        return;
    }

    originalTimeInSeconds = time;

    getQuestions(amount, category, difficulty);
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("quiz-box").classList.remove("hidden");
});




let questions = [];

async function getQuestions(amount, category, difficulty) {
    try {
        let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

        if (category) {
            url += `&category=${category}`;
        }
        if (difficulty) {
            url += `&difficulty=${difficulty}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        
        questions = data.results.map(q => {
            const answers = [...q.incorrect_answers, q.correct_answer];
            answers.sort(() => Math.random() - 0.5);

            return {
                question: q.question,
                answer: answers.map(ans => ({
                    text: ans,
                    correct: ans === q.correct_answer
                }))
            };
        });
        startGame();
    } catch (error) {
        console.error("Error loading questions", error);
        document.getElementById("question").innerText = "Error loading questions";
    }
}




const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("ans-btns");
const nextButtonsElement = document.getElementById("nxt-btn");

let currentQuestionIndex = 0;
let score = 0;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    startTimer(); 
    nextButtonsElement.innerHTML = "Next";
    showQuestion();
}




let timerInterval;


function startTimer() {
    clearInterval(timerInterval); 
    totalSeconds = originalTimeInSeconds; 
    document.getElementById("timer").classList.remove("text-red-600", "drop-shadow-[0_0_5px_red]");

    updateTimer(); 
    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimer();

        if (totalSeconds <= 3) {
            document.getElementById("timer").classList.add("text-red-600", "drop-shadow-[0_0_5px_red]");
        }

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            autoSelectWrongAnswer(); 
        }
    }, 1000);
}




function autoSelectWrongAnswer() {
    const allButtons = Array.from(answerButtonsElement.children);
    const correctButton = allButtons.find(btn => btn.dataset.correct === "true");

    if (correctButton) {
        correctButton.classList.add("bg-green-300");
    }

    allButtons.forEach(button => {
        button.disabled = true;
        button.classList.add("cursor-not-allowed");
    });

    nextButtonsElement.style.display = "block";
}




function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById("timer").innerText = `${minutes}:${seconds}`;
}




function showQuestion() {
    resetState();
    startTimer();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answer.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.className = "bg-purple-100 text-purple-950 font-medium w-full border border-purple-950 p-[10px] text-left rounded-[10px] enabled:hover:text-purple-100 enabled:hover:bg-purple-950 transition";
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
    clearInterval(timerInterval);
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
        document.getElementById("settings").classList.remove("hidden");
        document.getElementById("quiz-box").classList.add("hidden");
        nextButtonsElement.innerText = "Next"; 
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
    questionElement.innerHTML = `<b>Time's up!</b> You scored ${score} out of ${questions.length}`;
    answerButtonsElement.innerHTML = "";
    nextButtonsElement.innerText = "Play Again";
    nextButtonsElement.style.display = "block";
}
