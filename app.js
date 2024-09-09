document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    // Send the task to the server
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: taskText }),
    });

    if (response.ok) {
      // Create a new list item for the task
      const li = document.createElement('li');
      li.textContent = taskText;

      // Create and add the complete button with Font Awesome icon
      const completeButton = document.createElement('button');
      completeButton.innerHTML = '<i class="fas fa-check"></i> Complete';
      completeButton.className = 'complete';
      completeButton.addEventListener('click', () => {
        li.classList.toggle('complete');
      });

      // Create and add the delete button with Font Awesome icon
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
      deleteButton.className = 'delete';
      deleteButton.addEventListener('click', () => {
        li.remove();
      });

      li.appendChild(completeButton);
      li.appendChild(deleteButton);
      taskList.appendChild(li);

      taskInput.value = '';
    } else {
      console.error('Failed to add task');
    }
  });
});
