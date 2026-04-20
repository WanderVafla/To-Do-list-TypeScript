import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')

if (!input || !sendButton || !todosContainer) {
  throw new Error('Warning some html are missing')
}

// function addTask() {
//   if (!input.value.trim()) {
//     alert('Your task is empty!')
//     return
//   }
//   const newTaskElement = document.createElement('div')
//   newTaskElement.className = 'todo-element'
//   newTaskElement.textContent = input.value

//   todosContainer.insertAdjacentElement('afterbegin', newTaskElement)

//   input.value = ''
// }

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    return
  }
  const newTaskElement = document.createElement('div')
  newTaskElement.className = 'todo-element'
  newTaskElement.textContent = input.value

  todosContainer.insertAdjacentElement('afterbegin', newTaskElement)

  input.value = ''
}

sendButton?.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})

console.log('Hello from typescript')
