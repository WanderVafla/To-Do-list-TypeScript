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
  id: string
  name: string
  completed: boolean
}
/* 
  Teamplate a task element

<div class="todo-element" id="(crypto.randomUUID())" data-completed="(boolen)">
  <input type="checkbox" name="task-checkbox">
  (textNode)
</div>
*/
const createTaskEll = (name: string, id: string, completed = false): HTMLDivElement => {
  const taskContainer = document.createElement('div')
  taskContainer.className = 'todo-element'
  // TODO: find what i can use like id!
  taskContainer.id = id
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
  const id = crypto.randomUUID()
  todosContainer.insertAdjacentElement('afterbegin', createTaskEll(input.value, id))
  tasksArr.push({
    id: id,
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
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find(task => task.id === parent.id)
    if (task) {
      task.completed = target.checked
      parent.dataset.completed = String(target.checked)
      updateStorage('Tasks', JSON.stringify(tasksArr))
      console.log(task);
      
    }
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
        createTaskEll(task.name, task.id, task.completed),
      )
      tasksArr.push(task)
    }
  }
})

console.log('Hello from typescript')
