document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("taskInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let taskList = document.getElementById("taskList");
    let listItem = document.createElement("li");

    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
        taskList.removeChild(listItem);
    };

    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
    
    taskInput.value = "";
}