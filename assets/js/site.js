const ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

ready(() => {
  document.querySelectorAll("[data-hint-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.hintToggle);
      if (!target) return;
      target.classList.toggle("hidden");
      btn.querySelectorAll("span[data-label]").forEach((label) => {
        label.classList.toggle("hidden");
      });
    });
  });

  document.querySelectorAll("form[data-mini-check]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const results = [];
      form.querySelectorAll("[data-answer]").forEach((input) => {
        const wrapper = input.closest("label") ?? input.closest("div");
        if (!wrapper) return;
        wrapper.classList.remove("bg-green-100", "bg-red-100");
        const expected = input.dataset.answer;
        const value = input.type === "checkbox" ? input.checked.toString() : input.value.trim().toLowerCase();
        const correct = value === expected.toLowerCase();
        if (correct) {
          wrapper.classList.add("bg-green-100");
        } else {
          wrapper.classList.add("bg-red-100");
        }
        results.push(correct);
      });
      const score = results.filter(Boolean).length;
      const feedback = form.querySelector("[data-mini-feedback]");
      if (feedback) {
        feedback.textContent = `You answered ${score} / ${results.length} correctly. Review highlighted items.`;
        feedback.classList.remove("hidden");
      }
    });
  });

  document.querySelectorAll("form[data-quiz]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = form.querySelectorAll("[data-question]");
      let correct = 0;
      questions.forEach((question) => {
        const answer = question.dataset.answer;
        const inputs = question.querySelectorAll("input, textarea, select");
        let userValue = "";
        inputs.forEach((input) => {
          if (input.type === "radio" || input.type === "checkbox") {
            if (input.checked) {
              userValue = input.value;
            }
          } else {
            userValue = input.value.trim();
          }
        });
        const normalizedUserValue = userValue.trim().toLowerCase();
        const normalizedAnswer = answer.trim().toLowerCase();
        const feedback = question.querySelector("[data-feedback]");
        if (normalizedUserValue === normalizedAnswer) {
          correct += 1;
          question.classList.add("border-green-400");
          question.classList.remove("border-red-400");
          if (feedback) {
            feedback.textContent = feedback.dataset.correct;
          }
        } else {
          question.classList.add("border-red-400");
          question.classList.remove("border-green-400");
          if (feedback) {
            feedback.textContent = feedback.dataset.incorrect;
          }
        }
      });
      const result = form.querySelector("[data-quiz-result]");
      if (result) {
        result.textContent = `Score: ${correct} / ${questions.length}`;
      }
      const printable = form.querySelector("[data-print]");
      if (printable) {
        printable.classList.remove("hidden");
      }
    });
  });
});
