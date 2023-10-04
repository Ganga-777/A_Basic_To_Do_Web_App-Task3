document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from local storage
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    renderTasks('pendingList', pendingTasks);
    renderTasks('completedList', completedTasks);
});

function addTask() {
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskInput = document.getElementById('taskInput');

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const taskText = taskInput.value.trim();

    if (title !== '' && description !== '' && taskText !== '') {
        const newTask = {
            title: title,
            description: description,
            text: taskText,
            date: new Date().toLocaleString(),
            completed: false
        };

        const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
        pendingTasks.push(newTask);
        localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));

        renderTasks('pendingList', pendingTasks);

        // Clear the input fields
        taskTitle.value = '';
        taskDescription.value = '';
        taskInput.value = '';
    }
}

function toggleTaskStatus(index, listType) {
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    const taskToToggle = listType === 'pending' ? pendingTasks[index] : completedTasks[index];

    taskToToggle.completed = !taskToToggle.completed;

    if (listType === 'pending') {
        pendingTasks.splice(index, 1);
        completedTasks.push(taskToToggle);
    } else {
        completedTasks.splice(index, 1);
        pendingTasks.push(taskToToggle);
    }

    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    renderTasks('pendingList', pendingTasks);
    renderTasks('completedList', completedTasks);
}

function deleteTask(index, listType) {
    const tasks = listType === 'pending' ?
        JSON.parse(localStorage.getItem('pendingTasks')) || [] :
        JSON.parse(localStorage.getItem('completedTasks')) || [];

    tasks.splice(index, 1);

    if (listType === 'pending') {
        localStorage.setItem('pendingTasks', JSON.stringify(tasks));
        renderTasks('pendingList', tasks);
    } else {
        localStorage.setItem('completedTasks', JSON.stringify(tasks));
        renderTasks('completedList', tasks);
    }
}

function clearCompletedTasks() {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    localStorage.setItem('completedTasks', JSON.stringify([]));
    renderTasks('completedList', []);
}

function clearAllTasks() {
    localStorage.setItem('pendingTasks', JSON.stringify([]));
    localStorage.setItem('completedTasks', JSON.stringify([]));
    renderTasks('pendingList', []);
    renderTasks('completedList', []);
}

function renderTasks(listId, tasks) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.title} - ${task.text} (${task.date})</span>
            <div>
                <button onclick="toggleTaskStatus(${index}, '${listId.includes('pending') ? 'pending' : 'completed'}')">Toggle</button>
                <button class="delete-btn" onclick="deleteTask(${index}, '${listId.includes('pending') ? 'pending' : 'completed'}')">Delete</button>
            </div>
        `;
        listElement.appendChild(li);
    });
}
