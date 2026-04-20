import './style.css'

const input = document.getElementById('todo-input') as HTMLInputElement
const sendButton = document.getElementById(
  'add-todo-button',
) as HTMLButtonElement
const todosContainer = document.getElementById(
  'todo-elements',
) as HTMLDivElement

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your taks is enmty!')
  }
  const newTaskElement = document.createElement('p')
  newTaskElement.textContent = input.value

  todosContainer?.insertAdjacentElement('beforebegin', newTaskElement)
}

sendButton?.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})

console.log('Hello from typescript')
