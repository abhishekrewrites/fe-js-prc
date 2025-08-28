const LIMIT = 20;
const TOTAL_LIMIT = 100;
let skip = 0;
let updatedData = [];

const elements = {
  total: null,
  lists: null,
  btn: null,
};

document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

const getURL = (s) => `https://dummyjson.com/todos?limit=${LIMIT}&skip=${s}`;

function initApp() {
  elements.total = document.querySelector("#total");
  elements.lists = document.querySelector("#lists");
  elements.btn = document.querySelector("#btn");
  elements.btn.addEventListener("click", handleLoadMore);
  renderUI();
}

async function fetchTodos() {
  const url = getURL(skip);
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function updateTotal(count) {
  const currentTotal = Number(elements.total.textContent);
  const newTotal = currentTotal + count;
  elements.total.textContent = newTotal;
  return newTotal;
}

function createTodoItem(todoData) {
  const todoItem = document.createElement("div");
  todoItem.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todoData.completed;

  const todoText = document.createElement("span");
  todoText.className = "todo-text";
  todoText.textContent = todoData.todo;

  if (todoData.completed) {
    todoText.style.textDecoration = "line-through";
    todoText.style.opacity = "0.6";
  }

  checkbox.addEventListener("change", function () {
    const isChecked = this.checked;
    if (isChecked) {
      todoText.style.textDecoration = "line-through";
      todoText.style.opacity = "0.6";
    } else {
      todoText.style.textDecoration = "none";
      todoText.style.opacity = "1";
    }

    const index = updatedData.findIndex((todo) => todo.id === todoData.id);
    if (index > -1) {
      updatedData[index].completed = isChecked;
    }
  });

  todoItem.appendChild(checkbox);
  todoItem.appendChild(todoText);

  return todoItem;
}

function createTodoElements(todos) {
  const fragment = document.createDocumentFragment();
  for (let todoData of todos) {
    const todoItem = createTodoItem(todoData);
    fragment.appendChild(todoItem);
  }
  return fragment;
}

function checkIfShouldHideButton(total) {
  if (total >= TOTAL_LIMIT) {
    elements.btn.style.display = "none";
  }
}

async function renderUI() {
  elements.btn.disabled = true;

  const data = await fetchTodos();
  const todos = data.todos;

  updatedData = [...updatedData, ...todos];

  const newTotal = updateTotal(todos.length);

  const todoElements = createTodoElements(todos);
  elements.lists.appendChild(todoElements);

  checkIfShouldHideButton(newTotal);

  elements.btn.disabled = false;
}

async function handleLoadMore() {
  skip += LIMIT;
  await renderUI();
}
