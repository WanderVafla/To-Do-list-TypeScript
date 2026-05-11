import './style.css'

import { ERRORS, LOG_MESSAGE } from './constants'
import { createCategoryEle, createTaskEl } from './elements'
import {
  categories,
  checkMessageOverdue,
  setColorCategoryToTask,
  tasksArr,
  updateCategories,
  updateCategoriesTodos,
  updateTasksArr,
} from './taskManager'
import { getCurrentDate } from './utils'
import './taskEventsHandler'
import './categoriesEventsHandler'
import {
  categoriesElsContainer,
  dateInput,
  todosContainer,
} from './DOMElements'

if (!dateInput) {
  throw new Error(ERRORS.DOM.RootNotFound)
}
// Set minimal date for input calendar
dateInput.min = getCurrentDate()

window.addEventListener('DOMContentLoaded', async () => {
  if (!categoriesElsContainer || !todosContainer) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }

  await updateTasksArr()
  await updateCategories()
  await updateCategoriesTodos()
  for (const category of categories) {
    const categoryEl = createCategoryEle(category)
    categoriesElsContainer.appendChild(categoryEl)
  }
  for (const task of tasksArr) {
    const taskEle = createTaskEl(task)
    setColorCategoryToTask(taskEle.border, Number(taskEle.parent.id))
    todosContainer.insertAdjacentElement('afterbegin', taskEle.border)
  }
  checkMessageOverdue()
  console.log(LOG_MESSAGE.task_loaded)
})

console.log(LOG_MESSAGE.loaded_typescript)
