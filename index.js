let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(filterType) {
  const taskContainer = document.getElementById("tasks");
  taskContainer.innerHTML = "";

  let filteredTasks;

  if (filterType === "completed") {
    filteredTasks = tasks.filter((task) => task.isComplete);
  } else if (filterType === "incomplete") {
    filteredTasks = tasks.filter((task) => !task.isComplete);
  } else {
    filteredTasks = tasks; // Show all tasks
  }

  filteredTasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.className = `task ${task.isComplete ? "completed" : ""}`;
    taskElement.draggable = true;

    taskElement.ondragstart = (e) => startDrag(e, index);
    taskElement.ondragover = (e) => allowDrop(e);
    taskElement.ondrop = (e) => dropTask(e, index);
    taskElement.ondragleave = (e) => dragLeave(e);

    taskElement.innerHTML = `
      <span>
        <input type="checkbox" ${
          task.isComplete ? "checked" : ""
        } onclick="toggleComplete(${index})">
        ${task.description}
      </span>
      <span>
        <input type="date" value="${
          task.dueDate
        }" onchange="updateDueDate(${index}, this.value)">
        <button onclick="deleteTask(${index})">Delete</button>
      </span>
    `;

    taskContainer.appendChild(taskElement);
  });
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const taskDescription = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!taskDescription) {
    alert("Task description cannot be empty!");
    return;
  }

  tasks.push({
    description: taskDescription,
    isComplete: false,
    dueDate: dueDate || new Date().toISOString().split("T")[0],
  });

  taskInput.value = "";
  dueDateInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].isComplete = !tasks[index].isComplete;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateDueDate(index, newDate) {
  tasks[index].dueDate = newDate;
  saveTasks();
  renderTasks();
}

let draggedTaskIndex = null;

function startDrag(event, index) {
  draggedTaskIndex = index;
  event.dataTransfer.setData("text", index);
}

function allowDrop(event) {
  event.preventDefault();
  const taskElement = event.target.closest(".task");
  if (taskElement) {
    taskElement.classList.add("dragover");
  }
}

function dropTask(event, targetIndex) {
  event.preventDefault();

  const draggedIndex = event.dataTransfer.getData("text");
  const draggedTask = tasks[draggedIndex];

  tasks.splice(draggedIndex, 1);
  tasks.splice(targetIndex, 0, draggedTask);

  saveTasks();
  renderTasks();
}

function dragLeave(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement) {
    taskElement.classList.remove("dragover");
  }
}

function renderTasks() {
  filterTasks("all");
}

renderTasks();
