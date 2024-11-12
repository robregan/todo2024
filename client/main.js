document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form')
  const todoList = document.getElementById('todo-list')
  const newTodoInput = document.getElementById('new-todo')

  // Function to load todos from the server
  async function loadTodos() {
    try {
      const response = await fetch('http://localhost:5000/todos')
      const todos = await response.json()

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

  async function toggleComplete(id, isCompleted) {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
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
      const response = await fetch('http://localhost:5000/todos', {
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
      await fetch(`http://localhost:5000/todos/${id}`, {
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
