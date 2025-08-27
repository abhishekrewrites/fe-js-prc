const DEBOUNCED_DELAY = 400;
const LIMIT = 10;

let app;
let container;
let searchInput;

let apiResponse;

function debounce(cb, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
}

function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag);
  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

async function fetchData(q) {
  const API_URL = `https://dummyjson.com/products/search?q=${q}&limit=${LIMIT}&skip=0`;
  const response = await fetch(API_URL);
  apiResponse = await response.json();
}

const debouncedCall = debounce(fetchData, DEBOUNCED_DELAY);

function handleOnChange() {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    debouncedCall(value);
  });
}

function getDomNodes() {
  app = document.getElementById("app");
  container = document.getElementById("container");
  searchInput = document.getElementById("search");
}

function initApp() {
  getDomNodes();
  handleOnChange();
  renderUI();
}

function renderUI() {
  const lists = createElement("div", ["lists"], { name: "lists", id: "lists" });
  lists.innerHTML = `
    <div>ss</div>
  `;
  app.append(lists);
}
