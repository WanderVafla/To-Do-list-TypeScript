import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')

if (!input || !sendButton || !todosContainer) {
  throw new Error('Warning some html are missing')
}

interface Task {
  name: string
}
const createTaskEll = (name: string): HTMLDivElement => {
  const taskContainer = document.createElement('div')
  taskContainer.className = 'todo-element'

  const checkboxInput = document.createElement('input')
  checkboxInput.type = 'checkbox'
  taskContainer.appendChild(checkboxInput)

  const textNode = document.createTextNode(name)
  taskContainer.appendChild(textNode)

  return taskContainer
}

const tasksArr: Task[] = []
const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }

  todosContainer.insertAdjacentElement('afterbegin', createTaskEll(input.value))
  tasksArr.push({
    name: input.value,
  })
  localStorage.setItem('Tasks', JSON.stringify(tasksArr))

  input.value = ''
}

sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTaskjs = JSON.parse(savedTasks)
    for (const task of jsonTaskjs) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(task.name),
      )
    }
  }
})

console.log('Hello from typescript')
