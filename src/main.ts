import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')

if (!input || !sendButton || !todosContainer) {
  throw new Error('Warning some html are missing')
}
// array with all tasks parameters
const tasksArr: Task[] = []
// parameter of task
interface Task {
  name: string
  completed: boolean
}
// teamplate for task element
/* 
<div class="todo-element" data-index="34" data-completed="true">
  <input type="checkbox" name="task-checkbox">
  (task name)
</div>
*/
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
  // checking if string is empty
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }
  // add a new taks element in DOM
  todosContainer.insertAdjacentElement('afterbegin', createTaskEll(input.value))
  tasksArr.push({
    name: input.value,
    completed: false,
  })
  updateStorage('Tasks', JSON.stringify(tasksArr))

  input.value = ''
}
// Listenners for add a new task in list
sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})
// Function for update a localStorage
const updateStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}
// Listenner for task checkbox
todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const container = target.closest<HTMLDivElement>('[data-index]')
  if (container) {
    const containerIndex = Number(container.dataset.index)
    const taskItem = tasksArr[containerIndex]
      taskItem.completed = target.checked
      container.dataset.completed = String(target.checked)
      updateStorage('Tasks', JSON.stringify(tasksArr))
  }
})
// loading a data from localStorage after load a DOM elements
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTasks = JSON.parse(savedTasks) as Task[]
    for (const task of jsonTasks) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(task.name, task.completed),
      )
      tasksArr.push(task)
    }
  }
})

console.log('Hello from typescript')
