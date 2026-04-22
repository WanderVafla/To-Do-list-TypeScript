import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')
const temp = document.querySelector<HTMLTemplateElement>('#todo-template')

if (!input || !sendButton || !todosContainer || !temp) {
  throw new Error('Warning some html are missing')
}
let tasksArr: Task[] = []
interface Task {
  id: string
  name: string
  completed: boolean
}
/* 
  Template is in index.html with id="todo-template"

  Result after function:
  <div class="todo-element" id="crypto.randomUUID()" data-completed="boolean">
    <label class="todo-element__label">
      <input type="checkbox" name="task-checkbox">
      <span class="todo-element__text"></span>
    </label>
    <button type="button" data-action="remove">Remove</button>
  </div>
*/
const createTaskEll = (
  name: string,
  id: string,
  completed = false,
): HTMLDivElement => {
  const clonTemp = temp.content.cloneNode(true) as DocumentFragment
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taskTextSpan = clonTemp.querySelector<HTMLSpanElement>('.todo-element__text')
  const checkbox = clonTemp.querySelector<HTMLInputElement>(
    '[name="task-checkbox"]',
  )
  if (!taskTextSpan || !parentDiv || !checkbox) {
    throw new Error('Warning some html of todo-template are missing')
  }
  parentDiv.id = id
  parentDiv.dataset.completed = String(completed)
  checkbox.checked = completed
  taskTextSpan.textContent = name
  return parentDiv
}

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }
  // result ${string}-${string}-${string}-${string}-${string}
  const id = crypto.randomUUID()
  todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEll(input.value, id),
  )
  tasksArr.push({
    id: id,
    name: input.value,
    completed: false,
  })
  updateStorage()

  input.value = ''
}
const updateStorage = () => {
  localStorage.setItem('Tasks', JSON.stringify(tasksArr))
}
sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})
todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find((task) => task.id === parent.id)
    if (task) {
      task.completed = target.checked
      parent.dataset.completed = String(target.checked)
      updateStorage()
      console.log(task)
    }
  }
})

todosContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  if (target.dataset.action === 'remove') {
    const parent = target.closest<HTMLDivElement>('.todo-element')
    if (parent) {
      parent.remove()
      tasksArr = tasksArr.filter((task) => task.id !== parent.id)
      updateStorage()
    }
  }
})

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
