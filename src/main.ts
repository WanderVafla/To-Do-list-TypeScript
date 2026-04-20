import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')

if (!input || !sendButton || !todosContainer) {
  throw new Error('Warning some html are missing')
}

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    return
  }
  const newTaskElement = document.createElement('div')
  newTaskElement.className = 'todo-element'
  newTaskElement.textContent = input.value

  todosContainer.insertAdjacentElement('afterbegin', newTaskElement)
  const tasksToSave = todosContainer.innerHTML
  localStorage.setItem('Tasks', tasksToSave)
  input.value = ''
}

sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) =>
  event.key === 'Enter' ? addTask() : '',
)

window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    todosContainer.innerHTML = savedTasks
  }
})

console.log('Hello from typescript')
