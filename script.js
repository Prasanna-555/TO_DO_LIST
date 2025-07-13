const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const clearBtn = document.getElementById("clear-completed");
const taskCount = document.getElementById("task-count");
const themeToggle = document.getElementById("toggle-theme");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = "all", searchQuery = "") {
  taskList.innerHTML = "";
  let filtered = tasks.filter(task => {
    if (filter === "all") return true;
    return filter === "completed" ? task.completed : !task.completed;
  }).filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()));

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>
        <span class="priority-${task.priority}">[${task.priority}]</span> ${task.text}
      </span>
      <div class="actions">
        <button onclick="toggleTask(${index})">${task.completed ? "↩️" : "✅"}</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateCount();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


  

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (text) {
    tasks.push({ text, completed: false, priority });
    taskInput.value = "";
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim()) {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function updateCount() {
  const count = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${count} task${count !== 1 ? "s" : ""} left`;
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
}

function switchTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function exportTasks() {
  const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "todo-tasks.json";
  a.click();
}

function importTasks(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedTasks = JSON.parse(event.target.result);
      if (Array.isArray(importedTasks)) {
        tasks = importedTasks;
        renderTasks();
      }
    } catch (error) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter, searchInput.value);
  });
});

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
searchInput.addEventListener("input", () => {
  renderTasks(document.querySelector(".filter-btn.active").dataset.filter, searchInput.value);
});
clearBtn.addEventListener("click", clearCompleted);
themeToggle.addEventListener("click", switchTheme);
exportBtn.addEventListener("click", exportTasks);
importBtn.addEventListener("change", importTasks);

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  renderTasks();
  Sortable.create(taskList, {
    animation: 150,
    onEnd: function (evt) {
      const item = tasks.splice(evt.oldIndex, 1)[0];
      tasks.splice(evt.newIndex, 0, item);
      renderTasks();
    }
  });
};
