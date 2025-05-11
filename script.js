let textVal = document.getElementById('textVal');
let addBtn = document.querySelector('.add-project-btn');
let taskSections = document.querySelectorAll('.tasksSection');
let form = document.getElementById('form');
let counter = 0;
let tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];

// Prevent page refresh
form.addEventListener('submit', function(e){
  e.preventDefault();
});

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

// Load saved tasks from localStorage
function loadTasksFromStorage() {
  for (var i = 0; i < tasksArray.length; i++) {
    var task = tasksArray[i];
    createTaskElement(task.text, task.id, task.sectionIndex);
  }
}

// Create and place task
function createTaskElement(text, id, sectionIndex) {
  var li = document.createElement("li");
  li.innerHTML = text;
  li.setAttribute("draggable", "true");
  li.setAttribute("id", id);
  li.addEventListener('dragstart', dragStart);
  taskSections[sectionIndex].appendChild(li);
}

// Add new task
addBtn.addEventListener('click', function(){
  var textValue = textVal.value.trim();
  if (textValue === "") return;

  var taskId = counter + "";
  var sectionIndex = 0;

  tasksArray.push({
    text: textValue,
    id: taskId,
    sectionIndex: sectionIndex
  });

  createTaskElement(textValue, taskId, sectionIndex);
  saveToLocalStorage();
  counter++;
  textVal.value = "";
});

// Drag and Drop
function dragStart(e){
  e.dataTransfer.setData("text", e.target.id);
}

function dropFunc(e){
  e.preventDefault();
  var draggedId = e.dataTransfer.getData('text');
  var draggedItem = document.getElementById(draggedId);
  this.appendChild(draggedItem);

  for (var i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id === draggedId) {
      for (var j = 0; j < taskSections.length; j++) {
        if (taskSections[j] === this) {
          tasksArray[i].sectionIndex = j;
          break;
        }
      }
      break;
    }
  }
  saveToLocalStorage();
}

function dragOverFunc(e){
  e.preventDefault();
}

// Add drop event to all sections
for (var i = 0; i < taskSections.length; i++) {
  taskSections[i].addEventListener('drop', dropFunc);
  taskSections[i].addEventListener('dragover', dragOverFunc);
}

// Load tasks on page load
loadTasksFromStorage();