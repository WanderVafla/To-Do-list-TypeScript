import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')

if (!input || !sendButton || !todosContainer) {
  throw new Error('Warning some html are missing')
}

const tasksArr: Task[] = []

interface Task {
  name: string
  completed: boolean
}
const createTaskEll = (name: string, completed = false): HTMLDivElement => {
  const taskContainer = document.createElement('div')
  taskContainer.className = 'todo-element'
  taskContainer.dataset.index = `${tasksArr.length}`
  taskContainer.dataset.completed = `${completed}`

  const checkboxInput = document.createElement('input')
  checkboxInput.type = 'checkbox'
  checkboxInput.name = 'task-checkbox'
  checkboxInput.checked = completed

  taskContainer.appendChild(checkboxInput)
  
  const textNode = document.createTextNode(name)
  taskContainer.appendChild(textNode)
  

  return taskContainer
}

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }

  todosContainer.insertAdjacentElement('afterbegin', createTaskEll(input.value))
  tasksArr.push({
    name: input.value,
    completed: false,
  })
  updateStorage('Tasks', JSON.stringify(tasksArr))

  input.value = ''
}

sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})

const updateStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const container = target.closest<HTMLDivElement>('[data-index]')
  if (container) {
    const containerIndex = Number(container.dataset.index)
    const taskItem = tasksArr[containerIndex]
    if (target.checked) {
      taskItem.completed = true
      container.dataset.completed = "true"
      updateStorage('Tasks', JSON.stringify(tasksArr))
    } else {
      taskItem.completed = false
      container.dataset.completed = "false"
      updateStorage('Tasks', JSON.stringify(tasksArr))
    }
  }
  console.log(tasksArr)
})

window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTaskjs = JSON.parse(savedTasks)
    for (const task of jsonTaskjs) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(task.name, task.completed),
      )
      tasksArr.push(task)
    }
    console.log(tasksArr)
  }
})

console.log('Hello from typescript')
