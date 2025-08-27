let app = document.getElementById("app");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let telephone = document.getElementById("telephone");
let calender = document.getElementById("date");
let submit = document.getElementById("submit");

document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

function initApp() {
  submit.addEventListener("click", () => {
    const fromObj = getFormData();
    console.log(fromObj);
  });
}

function getFormData() {
  return {
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    telephone: telephone.value.trim(),
    calender: calender.value.trim(),
  };
}
