document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form')
  const todoList = document.getElementById('todo-list')
  const newTodoInput = document.getElementById('new-todo')

  // Function to load todos from the server
  async function loadTodos() {
    try {
      // Fetch the list of todos from the backend
      const response = await fetch('https://todo2024-7feb.onrender.com/todos')

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const todos = await response.json()

      // Clear the existing todos in the DOM to avoid duplication
      const todoList = document.getElementById('todo-list')
      todoList.innerHTML = ''

      // Add each todo to the DOM
      todos.forEach((todo) => {
        addTodoToDOM(todo)
      })
    } catch (error) {
      console.error('Failed to load todos:', error)
    }
  }

  // Function to add a todo to the DOM
  function addTodoToDOM(todo) {
    const listItem = document.createElement('li')
    listItem.classList.add('todo-item')
    listItem.dataset.id = todo._id

    // Checkbox for marking complete
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = todo.completed // Set to checked if todo is already completed
    checkbox.addEventListener('change', () =>
      toggleComplete(todo._id, checkbox.checked)
    )

    // Text content with strikethrough if completed
    const textSpan = document.createElement('span')
    textSpan.textContent = todo.text
    if (todo.completed) textSpan.classList.add('completed')

    // Trash button for deleting
    const deleteButton = document.createElement('button')
    deleteButton.textContent = '🗑️' // Trash icon
    deleteButton.classList.add('delete-button')
    deleteButton.addEventListener('click', () => deleteTodo(todo._id))

    // Append elements
    listItem.appendChild(checkbox)
    listItem.appendChild(textSpan)
    listItem.appendChild(deleteButton)
    todoList.appendChild(listItem)
  }

  // Example function to add a new todo
  function addTodo(text) {
    fetch('https://todo2024-7feb.onrender.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text, completed: false }), // Send new todo to backend
    })
      .then((response) => response.json())
      .then((newTodo) => {
        console.log('Todo added:', newTodo)
        fetchTodos() // Re-fetch the todos to update the list
      })
      .catch((error) => console.error('Error adding todo:', error))
  }

  async function toggleComplete(id, isCompleted) {
    try {
      await fetch(`https://todo2024-7feb.onrender.com/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted }),
      })
      const listItem = document.querySelector(`li[data-id='${id}'] span`)
      if (isCompleted) {
        listItem.classList.add('completed')
      } else {
        listItem.classList.remove('completed')
      }
    } catch (error) {
      console.error('Failed to toggle completion status:', error)
    }
  }

  // Function to handle form submission (add new todo)
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const taskText = newTodoInput.value.trim()
    if (!taskText) return

    try {
      const response = await fetch('https://todo2024-7feb.onrender.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: taskText }),
      })
      const newTodo = await response.json()
      addTodoToDOM(newTodo)

      newTodoInput.value = '' // Clear input
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  })

  // Function to delete a todo
  async function deleteTodo(id) {
    try {
      await fetch(`https://todo2024-7feb.onrender.com/todos/${id}`, {
        method: 'DELETE',
      })
      const listItem = document.querySelector(`li[data-id='${id}']`)
      listItem.remove()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  // Initial load of todos
  loadTodos()
})
