//variables
let todoItems = [];
const todoInput = document.querySelector(".todo-input");
const completedTodosDiv = document.querySelector(".completed-todos");
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos");
//const audio = new Audio('sound.mp3')

//get todo list on first boot
window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }

  render();
};

//get the content typed into the input
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode == 13) {
    //enter
    addTodo(value);

    todoInput.value = "";
    todoInput.focus();
  }
};

//add todo
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });

  saveAndRender();
}

//Remove todo
function removeTodo(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

//mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }

    return todo;
  });

  saveAndRender();
}

//mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }

    return todo;
  });

  saveAndRender();
}

//save in localstorage

function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//render
function render() {
  let unCompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);

  completedTodosDiv.innerHTML = "";
  uncompletedTodosDiv.innerHTML = "";

  if (unCompletedTodos.length > 0) {
    unCompletedTodos.forEach((todo) => {
      uncompletedTodosDiv.append(createTodoElement(todo));
    });
  } else {
    uncompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted mission </div>`;
  }
  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'Completed (${completedTodos.length} / ${todoItems.length})></div>`;

    completedTodos.forEach((todo) => {
      completedTodosDiv.append(createTodoElement(todo));
    });
  }
}

//save and render
function saveAndRender() {
  save();
  render();
}

//create todo list item
function createTodoElement(todo) {
  //create todo list container
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data-id", todo.id);
  todoDiv.className = "todo-item";

  //create todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;

  //checkbox foe list
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.checked = todo.completed;
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    e.target.checked ? markAsCompleted(id) : markAsCompleted(id);
  };

  //delete buttn for list

  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-square-x"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="#2c3e50"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M10 10l4 4m0 -4l-4 4" /></svg`;

  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodo(id);
  };

  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);

  return todoDiv;
}
