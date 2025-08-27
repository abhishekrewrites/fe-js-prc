document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

function initApp() {
  setUpEventListeners();
}

function setUpEventListeners() {
  const createForm = document.getElementById("create-form");
  if (createForm) {
    createForm.addEventListener("submit", handleSubmit);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const createInputValue = document.getElementById("task-name").value.trim();
  const isCompleted = document.getElementById("completed").checked;
}
