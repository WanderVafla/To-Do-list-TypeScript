import './style.css'

import {
  addTask,
  checkMessageOverdue,
  getCurrentDate,
  setTasksArr,
  type Task,
  tasksArr,
  updateStorage,
} from './api'
import { createTaskEll } from './elements'

export const input = document.querySelector<HTMLInputElement>('#todo-input')
export const sendButton =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
export const todosContainer =
  document.querySelector<HTMLDivElement>('#todo-elements')
export const deleteAllButton =
  document.querySelector<HTMLButtonElement>('#delete-all')
export const dateInput =
  document.querySelector<HTMLInputElement>('#todo-date-input')
export const todoTemplate =
  document.querySelector<HTMLTemplateElement>('#todo-template')
export const overdueContainer =
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

dateInput.min = getCurrentDate()

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

// Button add
sendButton.addEventListener('click', () => {
  addTask(input, todosContainer, todoTemplate, dateInput, overdueContainer)
})
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask(input, todosContainer, todoTemplate, dateInput, overdueContainer)
  }
})
// Checkbox
todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find((task) => task.id === parent.id)
    if (task) {
      task.completed = target.checked
      parent.dataset.completed = String(target.checked)
      updateStorage(overdueContainer)
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
      const filteredTasksArr = tasksArr.filter((task) => task.id !== parent.id)
      setTasksArr(filteredTasksArr)
      updateStorage(overdueContainer)
    }
  }
})
// Remove all
deleteAllButton.addEventListener('click', () => {
  todosContainer.replaceChildren()
  setTasksArr([])
  updateStorage(overdueContainer)
})

window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTasks = JSON.parse(savedTasks) as Task[]
    for (const task of jsonTasks) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(
          todoTemplate,
          task.name,
          task.id,
          task.due,
          task.completed,
        ),
      )
      tasksArr.push(task)
    }
    checkMessageOverdue(overdueContainer)
  }
})

console.log('Hello from typescript')
