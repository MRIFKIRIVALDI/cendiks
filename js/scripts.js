// Tailwind CSS configuration
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
};

// Toggle content function
function toggleContent(contentId) {
  const content = document.getElementById(contentId);
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
  } else {
    content.classList.add('hidden');
  }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const sessionsGrid = document.getElementById('sessionsGrid');

  if (searchInput && sessionsGrid) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const sessions = sessionsGrid.children;

      for (let session of sessions) {
        const title = session.querySelector('h4').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
          session.style.display = 'block';
        } else {
          session.style.display = 'none';
        }
      }
    });
  }
});

// Quiz functionality
function checkQuiz() {
  const quizResult = document.getElementById('quiz-result');
  let correctAnswers = 0;
  let totalQuestions = 0;

  // Get all quiz questions
  const questions = document.querySelectorAll('[name^="q"]');
  const questionGroups = {};

  // Group radio buttons by question
  questions.forEach(radio => {
    const questionName = radio.name;
    if (!questionGroups[questionName]) {
      questionGroups[questionName] = [];
    }
    questionGroups[questionName].push(radio);
  });

  // Check answers for each question
  for (const questionName in questionGroups) {
    totalQuestions++;
    const radios = questionGroups[questionName];
    let answered = false;
    let correct = false;

    for (const radio of radios) {
      if (radio.checked) {
        answered = true;
        // Define correct answers based on question
        const correctValue = getCorrectAnswer(questionName);
        if (radio.value === correctValue) {
          correct = true;
        }
        break;
      }
    }

    if (answered && correct) {
      correctAnswers++;
    }
  }

  // Display result
  if (totalQuestions > 0) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    quizResult.innerHTML = `<div class="p-4 rounded-lg ${percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
      <p class="font-semibold">Skor Anda: ${correctAnswers}/${totalQuestions} (${percentage}%)</p>
      <p>${percentage >= 70 ? 'Bagus! Anda memahami materi dengan baik.' : 'Coba lagi untuk meningkatkan pemahaman Anda.'}</p>
    </div>`;
  } else {
    quizResult.innerHTML = '<p class="text-gray-600">Tidak ada pertanyaan yang dijawab.</p>';
  }
}

function getCorrectAnswer(questionName) {
  const answers = {
    'q1': 'b', // For session 1: Menampilkan teks ke layar
    'q2': 'a', // For session 1: Menguji instalasi Python
    // Add more correct answers for other sessions as needed
  };
  return answers[questionName] || 'a'; // Default to 'a' if not defined
}
