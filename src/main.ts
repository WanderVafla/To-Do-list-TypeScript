import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')
const deleteAllButton = document.querySelector<HTMLButtonElement>('#delete-all')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')
const todoTemplate =
  document.querySelector<HTMLTemplateElement>('#todo-template')
const overdueContainer =
    document.querySelector<HTMLParagraphElement>('#overdue-message')

// const
if (
  !input ||
  !sendButton ||
  !todosContainer ||
  !todoTemplate ||
  !deleteAllButton ||
  !dateInput ||
  !overdueContainer
) {
  throw new Error('Warning some html are missing')
}

/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
const getCurrentDate = (): string => {
  const date = new Date()
  const dateYear = date.getFullYear()
  const dateMonth = String(date.getMonth() + 1).padStart(2, '0')
  const dateDay = String(date.getDate()).padStart(2, '0')
  return `${dateYear}-${dateMonth}-${dateDay}`
}

// dateInput.min = getCurrentDate()

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
  <div class="todo-element" id="crypto.randomUUID()" data-completed="boolean", data-urgency="(critical | high | medium | low)?">
    <label class="todo-element__label">
      <input type="checkbox" name="task-checkbox">
      <span class="todo-element__text"></span>
    </label>
    <button type="button" data-action="remove">Remove</button>
    <p class="due-date">
      <date datetime="date">date
    </p>
  </div>
*/
const checkMessageOverdue = () => {
    let text = ''
    for (const task of tasksArr) {
      const diffDays = getDaysDueDiff(task.due)
      if (task.completed === false && diffDays < 0) {
        text += `${task.name}\n`
      }
    overdueContainer.textContent = text
  }
}
const createTaskEll = (
  name: string,
  id: string,
  due: string,
  completed = false,
): HTMLDivElement => {
  const clonTemp = todoTemplate.content.cloneNode(true) as DocumentFragment
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
    dateEl.textContent = due
    dueDateP.appendChild(dateEl)

    const diffDays = getDaysDueDiff(due)
    if (diffDays < 0) {
      parentDiv.dataset.urgency = 'critical'
    } else if (diffDays === 0 || diffDays === 1) {
      parentDiv.dataset.urgency = 'high'
    } else if (diffDays >= 2 && diffDays <= 4) {
      parentDiv.dataset.urgency = 'medium'
    } else {
      parentDiv.dataset.urgency = 'low'
    }
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
  checkMessageOverdue()

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
      checkMessageOverdue()
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
      checkMessageOverdue()
    }
  }
})
// Remove all
deleteAllButton.addEventListener('click', () => {
  todosContainer.replaceChildren()
  tasksArr = []
  updateStorage()
  checkMessageOverdue()
})
const getDaysDueDiff = (due: string): number => {
  const targetDate = new Date(due)
  const currentDate = new Date(getCurrentDate())
  const diffTime = targetDate.getTime() - currentDate.getTime()
  // Calculate the difference in days
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
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
    checkMessageOverdue()
  }
})

console.log('Hello from typescript')
