const baseURL = "https://jsonplaceholder.typicode.com/todos";

let offset = 0;
let limit = 10;

let loading = false;

const fetchTodos = async () => {
  try {
    loading = true;
    const response = await fetch(baseURL);
    const todos = await response.json();

    loading = false;
    return displayTodos(todos.slice(offset, limit));
  } catch (error) {
    loading = false;
    console.error(error, "Fetch todo error.");
    throw new Error("Error fetching todos");
  }
};

(async () => {
  try {
    await fetchTodos();
  } catch (error) {
    throw new Error("Error fetching todos");
  }
})();

const todosContainer = document.querySelector(".scroll_items_container");

const displayTodos = (todos) => {
  const moreTodoItem = document.querySelector(".more_todo");
  if (moreTodoItem) {
    todosContainer.removeChild(moreTodoItem);
  }

  todos.forEach((todo) => {
    const scrollItem = document.createElement("li");
    scrollItem.innerHTML = todo.title;
    scrollItem.classList.add("scroll_item");
    todosContainer.appendChild(scrollItem);
  });

  const moreTodo = document.createElement("li");
  moreTodo.classList.add("more_todo");
  todosContainer.appendChild(moreTodo);

  if (loading) {
    moreTodo.innerHTML = "Loading...";
  } else {
    moreTodo.innerHTML = "";
  }

  let callback = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        if (offset <= 180) {
          offset += 10;
          limit += 10;
          await fetchTodos();
        }
      }
    });
  };
  let observer = new IntersectionObserver(callback, options);
  observer.observe(moreTodo);
};

let options = {
  root: document.querySelector(".scroll_items_container"),
  rootMargin: "0px",
  threshold: 1.0,
};
