import './style.css'

import { DeleteTask, GetTask, PatchTask } from './api'
import { createTaskEll } from './elements'
import {
  addTask,
  checkMessageOverdue,
  setTasksArr,
  type TaskArguments,
  tasksArr,
  updateTasksArr,
} from './taskManager'
import type { UpdateTaskData } from './types'
import { getCurrentDate } from './utils'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todosContainer = document.querySelector<HTMLDivElement>('#todo-elements')
const deleteAllButton = document.querySelector<HTMLButtonElement>('#delete-all')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')
const todoTemplate =
  document.querySelector<HTMLTemplateElement>('#todo-template')
const overdueContainer =
  document.querySelector<HTMLParagraphElement>('#overdue-message')

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
// Set minimal date for input calendare
dateInput.min = getCurrentDate()
// For addTask() function
const taskArrguments: TaskArguments = {
  input,
  todosContainer,
  todoTemplate,
  dateInput,
  overdueContainer,
}
// Button add
sendButton.addEventListener('click', () => {
  addTask(taskArrguments)
})
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask(taskArrguments)
  }
})
// Checkbox
todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find((task) => task.id.toString() === parent.id)
    if (task) {
      task.done = target.checked
      parent.dataset.completed = String(target.checked)
      const checkboxStatus: UpdateTaskData = { done: task.done }
      checkMessageOverdue(overdueContainer)
      PatchTask(parent.id, checkboxStatus).then((_) => updateTasksArr())
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
      checkMessageOverdue(overdueContainer)
      DeleteTask(parent.id.toString()).then((_) => updateTasksArr())
    }
  }
})
// Remove all
deleteAllButton.addEventListener('click', () => {
  todosContainer.replaceChildren()
  DeleteTask().then((_) => updateTasksArr())
  console.log('deleted all!')

  checkMessageOverdue(overdueContainer)
})

window.addEventListener('DOMContentLoaded', async () => {
  const tasks = await GetTask()
  setTasksArr(tasks)
  for (const task of tasksArr) {
    todosContainer.insertAdjacentElement(
      'afterbegin',
      createTaskEll(todoTemplate, task),
    )
  }
  checkMessageOverdue(overdueContainer)
  console.log('Task list is loaded!')
})

console.log('Hello from typescript')
