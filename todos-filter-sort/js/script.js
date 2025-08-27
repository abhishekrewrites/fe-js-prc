const LIMIT = 200;

let defaultFilter = "all";

const DROPDOWN_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Complete", value: "complete" },
  { label: "Incomplete", value: "incomplete" },
];

const elements = {
  app: null,
  lists: null,
  header: null,
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  elements.app = document.querySelector("#app");
  elements.lists = document.querySelector("#lists");
  elements.header = document.querySelector("#header");
  renderUI();
}

const getURL = () => `https://dummyjson.com/todos?limit=${LIMIT}&skip=${0}`;

async function fetchTodos() {
  const url = getURL();
  const response = await fetch(url);
  const resp = await response.json();
  return resp;
}

function buildElement(item) {
  const { todo, completed } = item;
  const todoItem = document.createElement("div");
  todoItem.className = "todo-item";

  const todoTitle = document.createElement("span");
  todoTitle.className = "title";
  todoTitle.textContent = todo;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = completed;

  todoItem.append(checkbox, todoTitle);
  return todoItem;
}

async function renderTodoLists() {
  let data = {};
  try {
    data = await fetchTodos();
  } catch (e) {
    data = {};
  }

  const { todos } = data;

  const finalTodos =
    defaultFilter === "all"
      ? todos
      : defaultFilter === "complete"
      ? todos.filter((item) => item.completed)
      : defaultFilter === "incomplete"
      ? todos.filter((item) => !item.completed)
      : [];

  elements.lists.innerHTML = "";

  const fragment = document.createDocumentFragment();
  if (finalTodos.length > 0) {
    for (let todo of finalTodos) {
      const item = buildElement(todo);
      fragment.append(item);
    }
    elements.lists.append(fragment);
  } else {
    elements.lists.innerHTML = `
      <div>Something happened. Please try after some time.</div>
    `;
  }
}

function renderHeaderItems() {
  const select = document.createElement("select");
  select.value = DROPDOWN_OPTIONS[0].value;
  const fragment = document.createDocumentFragment();
  for (let opt of DROPDOWN_OPTIONS) {
    const option = document.createElement("option");
    option.textContent = opt.label;
    option.value = opt.value;
    fragment.append(option);
  }
  select.append(fragment);
  elements.header.append(select);
  select.addEventListener("change", function () {
    const value = this.value;
    defaultFilter = value;
    renderTodoLists();
  });
}

function renderUI() {
  renderHeaderItems();
  renderTodoLists();
}
