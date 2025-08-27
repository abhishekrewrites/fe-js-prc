const LIMIT = 100;

const elements = {
  lists: null,
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  elements.lists = document.querySelector("#lists");
  renderUI();
}

const getURL = () => `https://dummyjson.com/todos?limit=${LIMIT}&skip=0`;

async function fetchTodos() {
  const url = getURL();
  const response = await fetch(url);
  const resp = await response.json();
  return resp;
}

function formatApiResponse(data) {
  return data.reduce((acc, element) => {
    const userId = element.userId;
    acc[userId] = acc[userId] || [];
    acc[userId].push(element);
    return acc;
  }, {});
}

function createBlock(d, key) {
  const block = document.createElement("div");
  block.className = "block";
  const blockTitle = document.createElement("h3");
  blockTitle.className = "block-title";
  blockTitle.textContent = key;

  block.append(blockTitle);

  for (const b of d) {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    const completedContainer = document.createElement("div");
    completedContainer.className = "todo-item-container";

    const completed = document.createElement("input");
    completed.type = "checkbox";
    completed.checked = b.completed;

    const completedSpan = document.createElement("span");
    completedSpan.textContent = "Completed";

    const title = document.createElement("div");
    title.textContent = b.todo;
    title.className = "title";

    if (completed.checked) {
      title.style.textDecoration = "line-through";
      title.style.opacity = "0.7";
    }
    completedContainer.append(completed, completedSpan);
    todoItem.append(title);
    todoItem.append(completedContainer);
    block.append(todoItem);
  }

  return block;
}

async function renderUI() {
  const apiRes = await fetchTodos();
  const { todos } = apiRes;
  const transformedData = formatApiResponse(todos);
  const keys = Object.keys(transformedData);
  const fragment = document.createDocumentFragment();
  for (let key of keys) {
    const item = createBlock(transformedData[key], key);
    fragment.append(item);
  }
  elements.lists.append(fragment);
}
