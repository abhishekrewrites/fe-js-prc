const LIMIT = 10;
let START = 0;
let app;
let observer;
let isLoading = false;
let hasMoreData = true;

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

function initApp() {
  app = document.getElementById("app");
  intersectionObserverInit();
  fetchData();
}

async function fetchData() {
  if (isLoading || !hasMoreData) return;

  isLoading = true;
  showLoader();

  const API_URL = `https://jsonplaceholder.typicode.com/posts?_start=${START}&_limit=${LIMIT}`;

  try {
    const resp = await fetch(API_URL);
    const response = await resp.json();

    if (response.length === 0) {
      hasMoreData = false;
      hideLoader();

      if (observer && observer.target) {
        observer.unobserve(observer.target);
      }

      showEndMessage();
      return;
    }

    const finalResponse = Array.isArray(response) ? response : [];
    renderUI(finalResponse);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    isLoading = false;
    hideLoader();
  }
}

function intersectionObserverInit() {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading && hasMoreData) {
        START += LIMIT;
        fetchData();
      }
    },
    {
      rootMargin: "200px",
      threshold: 0.1,
    }
  );
}

function renderUI(data) {
  let container = document.getElementById("container");

  if (!container) {
    container = createElement("div", ["container"], {
      name: "container",
      id: "container",
    });
    app.append(container);
  }

  data.forEach((element, idx) => {
    const globalIdx = START - LIMIT + idx;
    const listItem = createElement("div", ["list-item"], {
      name: "list-item",
      id: `list-item-${globalIdx}`,
    });
    listItem.innerHTML = `
      <h3>${element.title}</h3>
      <div>ID: ${element.id}</div>
    `;
    container.append(listItem);
  });

  attachObserver();
}

function attachObserver() {
  const lists = document.querySelectorAll(".list-item");
  const lastItem = lists[lists.length - 1];

  if (lastItem && hasMoreData) {
    if (observer.target) {
      observer.unobserve(observer.target);
    }

    observer.observe(lastItem);
    observer.target = lastItem;
  }
}

function showLoader() {
  hideLoader();
  const container = document.getElementById("container");
  if (container) {
    const loader = createElement("div", ["loading"], { id: "loader" });
    loader.innerHTML = "Loading more...";
    container.append(loader);
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.remove();
  }
}

function showEndMessage() {
  const container = document.getElementById("container");
  if (container) {
    const endMessage = createElement("div", ["end-message"], {
      id: "end-message",
    });
    endMessage.innerHTML = "No more posts to load!";
    container.append(endMessage);
  }
}
