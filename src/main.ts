import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')
const temp = document.querySelector<HTMLTemplateElement>('#todo-template')
const deleteAllButton = document.querySelector<HTMLButtonElement>('#delete-all')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')

if (
  !input ||
  !sendButton ||
  !todosContainer ||
  !temp ||
  !deleteAllButton ||
  !dateInput
) {
  throw new Error('Warning some html are missing')
}

/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
const getCurrnetData = (): string => {
  const date = new Date()
  const dateYear = date.getFullYear()
  const dateMonth = String(date.getMonth() + 1).padStart(2, '0')
  const dateDay = String(date.getDate()).padStart(2, '0')
  return `${dateYear}-${dateMonth}-${dateDay}`
}

dateInput.min = getCurrnetData()

let tasksArr: Task[] = []
interface Task {
  id: string
  name: string
  completed: boolean
  due: string
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
    <p class="due-date">
      <date datetime="2026-05-22">
      (Text node with date)
    </p>
  </div>
*/
const createTaskEll = (
  name: string,
  id: string,
  due: string,
  completed = false,
): HTMLDivElement => {
  const clonTemp = temp.content.cloneNode(true) as DocumentFragment
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taskTextSpan = clonTemp.querySelector<HTMLSpanElement>(
    '.todo-element__text',
  )
  const dueDateP = clonTemp.querySelector<HTMLParagraphElement>('.due-date')
  const checkbox = clonTemp.querySelector<HTMLInputElement>(
    '[name="task-checkbox"]',
  )
  if (!taskTextSpan || !parentDiv || !checkbox || !dueDateP) {
    throw new Error('Warning some html of todo-template are missing')
  }
  parentDiv.id = id
  parentDiv.dataset.completed = String(completed)
  checkbox.checked = completed
  taskTextSpan.textContent = name
  if (due !== '') {
    const dateEl = document.createElement('time')
    dateEl.dateTime = due
    dueDateP.appendChild(dateEl)
    const dateText = document.createTextNode(due)
    dateText.textContent = due
    dueDateP.appendChild(dateText)
  } else {
    dueDateP.textContent = 'no due date'
  }

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
    createTaskEll(input.value, id, dateInput.value),
  )

  tasksArr.push({
    id: id,
    name: input.value,
    completed: false,
    due: dateInput.value,
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
// Remove
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
// Remove all
deleteAllButton.addEventListener('click', () => {
  todosContainer.replaceChildren()
  tasksArr = []
  updateStorage()
})
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTasks = JSON.parse(savedTasks) as Task[]
    for (const task of jsonTasks) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(task.name, task.id, task.due, task.completed),
      )
      tasksArr.push(task)
    }
  }
})

console.log('Hello from typescript')
