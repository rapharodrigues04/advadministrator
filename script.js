let quizData = [];
let currentQuestion = 0;
let feedbackShown = false;

// Função para embaralhar o array de perguntas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Carregar quiz.json e iniciar
fetch('./quiz.json')
  .then(response => {
    if (!response.ok) throw new Error("Erro ao carregar o quiz.");
    return response.json();
  })
  .then(data => {
    shuffle(data); // embaralha as perguntas
    quizData = data;
    initQuiz();
  })
  .catch(error => {
    console.error("Erro ao carregar perguntas:", error);
    alert("Falha ao carregar as perguntas do quiz.");
  });

function initQuiz() {
  const openQuizBtn = document.getElementById("openQuiz");
  const modal = document.getElementById("quizModal");
  const closeBtn = document.querySelector(".close");
  const questionText = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const nextBtn = document.getElementById("nextBtn");
  const clearBtn = document.getElementById("clearBtn");

  openQuizBtn.onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    currentQuestion = 0;
    feedbackShown = false;
    modal.style.display = "flex";
    closeBtn.style.display = "inline-block";
    showQuestion();
  };

  closeBtn.onclick = () => {
    modal.style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
  };

  window.onclick = event => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.getElementById("startScreen").style.display = "flex";
    }
  };

  nextBtn.onclick = () => {
    const q = quizData[currentQuestion];
    const selectedEls = document.querySelectorAll(".answer.selected");

    if (!feedbackShown) {
      if (selectedEls.length === 0) {
        alert("Selecione uma resposta antes de continuar.");
        return;
      }

      const selectedIndices = Array.from(selectedEls).map(el => parseInt(el.dataset.index));

      if (q.multiple) {
        const correctSet = new Set(q.correct);
        const selectedSet = new Set(selectedIndices);

        document.querySelectorAll(".answer").forEach(el => {
          const index = parseInt(el.dataset.index);
          if (correctSet.has(index)) {
            el.classList.add("correct");
          }
          if (selectedSet.has(index) && !correctSet.has(index)) {
            el.classList.add("incorrect");
          }
          el.classList.add("disabled");
        });
      } else {
        const correctIndex = q.correct;
        const selectedIndex = selectedIndices[0];

        document.querySelectorAll(".answer").forEach(el => {
          const index = parseInt(el.dataset.index);
          if (index === correctIndex) {
            el.classList.add("correct");
          }
          if (index === selectedIndex && index !== correctIndex) {
            el.classList.add("incorrect");
          }
          el.classList.add("disabled");
        });
      }

      feedbackShown = true;
      nextBtn.textContent = "Continuar";
      return;
    }

    // Segundo clique - próxima pergunta
    currentQuestion++;
    feedbackShown = false;
    nextBtn.textContent = "Próxima";

    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      alert("Quiz finalizado!");
      modal.style.display = "none";
      document.getElementById("startScreen").style.display = "flex";
    }
  };

  clearBtn.onclick = () => {
    document.querySelectorAll(".answer").forEach(el => {
      el.classList.remove("selected", "correct", "incorrect", "disabled");
    });

    nextBtn.style.display = "none";
    feedbackShown = false;
    nextBtn.textContent = "Próxima";
  };

  function showQuestion() {
    const q = quizData[currentQuestion];
    questionText.textContent = q.question;
    answersContainer.innerHTML = "";

    closeBtn.style.display = "inline-block";
    nextBtn.style.display = "none";
    nextBtn.textContent = "Próxima";

    q.options.forEach((option, idx) => {
      const btn = document.createElement("div");
      btn.classList.add("answer");
      btn.textContent = option;
      btn.dataset.index = idx;

      btn.onclick = () => {
        if (btn.classList.contains("disabled") || feedbackShown) return;

        nextBtn.style.display = "inline-block";

        if (q.multiple) {
          btn.classList.toggle("selected");
        } else {
          document.querySelectorAll(".answer").forEach(el => el.classList.remove("selected"));
          btn.classList.add("selected");
        }
      };
      answersContainer.appendChild(btn);
    });
  }
}
