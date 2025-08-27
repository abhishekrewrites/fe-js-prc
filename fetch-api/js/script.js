const API_URL = "https://jsonplaceholder.typicode.com/todos";
const ITEMS_PER_PAGE = 10;
let apiResponse = [];
let currentPage = 1;
let isLoading = false;
let app;

function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag);
  if (classes.length > 0) {
    element.classList.add(...classes);
  }
  for (const key in attributes) {
    const val = attributes[key];
    element.setAttribute(key, val);
  }
  return element;
}

document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

function initApp() {
  app = document.getElementById("app");
  const container = createElement("div", ["container"], {
    name: "container",
    id: "container",
  });
  const pagination = createElement("div", ["pagination"], {
    name: "pagination",
    id: "pagination",
  });
  app.append(container, pagination);
  isLoading = true;
  fetchApi();
}

async function fetchApi() {
  try {
    const response = await fetch(API_URL);
    const resp = await response.json();
    apiResponse = resp;
    renderUI();
    renderPagination();
  } catch (e) {
    renderErrorStates();
  } finally {
    isLoading = false;
  }
}

function renderUI() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const finalData = apiResponse.slice(startIndex, endIndex);

  finalData.forEach((element, idx) => {
    const actualIndex = startIndex + idx;
    const listItem = createElement("div", ["list-item"], {
      name: "list-item",
      id: `list-item-${element.id}`,
    });

    listItem.innerHTML = `
      <h3>${element.title}</h3>
      <div>
        <input 
          onchange="handleCompleted(${idx})" 
          type="checkbox" 
          ${element.completed ? "checked" : ""} 
          name="completed" 
          id="completed-${element.id}" 
        />
        <label for="completed-${element.id}">Completed</label>
      </div>
    `;
    container.append(listItem);
  });
}

function handleCompleted(idx) {
  const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx;
  apiResponse[actualIndex].completed = !apiResponse[actualIndex].completed;
  renderUI();
}

function renderErrorStates() {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const errorDiv = createElement("div", ["error"], {
    name: "error",
    id: "error",
  });

  errorDiv.innerHTML = `
    <div>
      <h4>No Result found</h4>
    </div>
  `;

  container.append(errorDiv);
}

function renderPagination() {
  const existingPages = document.querySelectorAll(".page");
  existingPages.forEach((page) => page.remove());

  const total = apiResponse.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  Array(totalPages)
    .fill(null)
    .forEach((_, idx) => {
      const pageNum = idx + 1;
      const page = createElement("button", ["page"], {
        name: "page",
        id: `page-${pageNum}`,
        onclick: `handlePageClick(${pageNum})`,
      });
      page.innerText = pageNum;

      if (pageNum === currentPage) {
        page.classList.add("active");
      }

      document.getElementById("pagination").append(page);
    });
}

function handlePageClick(num) {
  currentPage = num;
  renderUI();
  renderPagination();
}
