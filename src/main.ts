import './style.css'

import {
  deleteAllTask,
  deleteCategory,
  deleteTask,
  getCategories,
  getTask,
  patchCategory,
  patchTask,
  postNewCategory,
} from './api'
import { createCategoryEle, createTaskEl } from './elements'
import {
  addTask,
  checkMessageOverdue,
  setTasksArr,
  tasksArr,
  updateTasksArr,
} from './taskManager'
import type { CategoryItemPostType, TaskArguments, TaskPostType } from './types'
import { getCurrentDate, isColorLight, rgbToHex } from './utils'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todosContainer = document.querySelector<HTMLDivElement>('#todo-elements')
const deleteAllButton = document.querySelector<HTMLButtonElement>('#delete-all')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')
const todoTemplate =
  document.querySelector<HTMLTemplateElement>('#todo-template')
const overdueContainer =
  document.querySelector<HTMLParagraphElement>('#overdue-message')
const openCategoriesButton = document.querySelector<HTMLButtonElement>(
  '#open-categories-button',
)
const closeCategoriesButton = document.querySelector<HTMLButtonElement>(
  '#close-categories-button',
)
const categoriesDialog =
  document.querySelector<HTMLDialogElement>('#categories-dialog')
const categoriesElsContainer = document.querySelector<HTMLDivElement>(
  '#categories-elements',
)
const categoryItemTemplate = document.querySelector<HTMLTemplateElement>(
  '#category-element-template',
)
const addCategoryButton = document.querySelector<HTMLButtonElement>(
  '#add-category-button',
)
const categoryNameInput = document.querySelector<HTMLInputElement>(
  '#category-name-input',
)
const categoryColorInput = document.querySelector<HTMLInputElement>(
  '#category-color-input',
)
const categoryColorInputText = document.querySelector<HTMLInputElement>(
  '#category-color-text',
)
if (
  !input ||
  !sendButton ||
  !todosContainer ||
  !todoTemplate ||
  !deleteAllButton ||
  !dateInput ||
  !overdueContainer ||
  !openCategoriesButton ||
  !closeCategoriesButton ||
  !categoriesDialog ||
  !categoriesElsContainer ||
  !categoryItemTemplate ||
  !addCategoryButton ||
  !categoryNameInput ||
  !categoryColorInput ||
  !categoryColorInputText
) {
  throw new Error('Warning some html are missing')
}
// Set minimal date for input calendar
dateInput.min = getCurrentDate()
// For addTask() function
const taskArguments: TaskArguments = {
  input,
  todosContainer,
  todoTemplate,
  dateInput,
  overdueContainer,
}
// Button add
sendButton.addEventListener('click', () => {
  addTask(taskArguments)
})
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask(taskArguments)
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
      const checkboxStatus: Partial<TaskPostType> = { done: task.done }
      checkMessageOverdue(overdueContainer)
      patchTask(parent.id, checkboxStatus).then((_) => updateTasksArr())
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
      deleteTask(parent.id.toString()).then((_) => updateTasksArr())
      checkMessageOverdue(overdueContainer)
    }
  }
})
// Remove all
deleteAllButton.addEventListener('click', () => {
  todosContainer.replaceChildren()
  deleteAllTask().then((_) => updateTasksArr())
  checkMessageOverdue(overdueContainer)
})
openCategoriesButton.addEventListener('click', () => {
  categoriesDialog.show()
})
closeCategoriesButton.addEventListener('click', () => {
  categoriesDialog.close()
})
/* 
  Visibility of category elements when you change name of color
  there is two hided containers for each category item 
  first: for change color
  second: for change name

  parent: for hide all elements into category item
  container: for do visible container what we need
  buttonTarget: button action we need them for toggle state
  hideOptional: other container what we not want to hide
  */

const setColorContrast = (color: string) => {
  if (isColorLight(color)) {
    return 'black'
  }
  return 'white'
}

categoriesElsContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  const parent = target.closest<HTMLSpanElement>('.category-element')
  if (!parent) {
    throw new Error('Error parent container')
  }
  const editDiv = parent.querySelector<HTMLDivElement>('.edit-container')
  const nameCategory =
    parent.querySelector<HTMLParagraphElement>('.category-name')
  if (target.dataset.action === 'edit') {
    const nameEditInput = parent.querySelector<HTMLInputElement>(
      '.category-name-input',
    )
    const colorInput = parent.querySelector<HTMLInputElement>(
      '.category-color-input',
    )
    const colorInputText = parent.querySelector<HTMLInputElement>(
      '.category-color-text',
    )
    if (
      !colorInput ||
      !editDiv ||
      !colorInputText ||
      !nameEditInput ||
      !nameCategory
    ) {
      throw new Error('Error color input')
    }
    const regexHex = /^#?([A-Fa-f0-9]{2}){3}$/
    const changeInputColor = () => (colorInputText.value = colorInput.value)
    const changeTextColor = () => {
      if (regexHex.test(colorInputText.value)) {
        colorInput.value = colorInputText.value
      }
    }
    const NAME_CLASS_HIDING_ELEMENTS = 'is-editing-color'
    const colorParent = parent.style.backgroundColor
    if (!parent.classList.contains(NAME_CLASS_HIDING_ELEMENTS)) {
      // Set the paramettre of edit container
      target.textContent = 'save'
      colorInput.value = `#${rgbToHex(parent.style.backgroundColor)}`
      colorInputText.value = `#${rgbToHex(parent.style.backgroundColor)}`
      nameEditInput.value = nameCategory.textContent
      colorInputText.style.color = setColorContrast(colorParent)
      colorInput.addEventListener('input', changeInputColor)
      colorInputText.addEventListener('focusout', changeTextColor)
      parent.classList.add(NAME_CLASS_HIDING_ELEMENTS)

      return
    }
    colorInput.removeEventListener('input', changeInputColor)
    colorInputText.removeEventListener('focusout', changeTextColor)
    parent.classList.remove(NAME_CLASS_HIDING_ELEMENTS)
    nameCategory.textContent = nameEditInput.value
    if (regexHex.test(colorInputText.value)) {
      const newDataCategory: Partial<CategoryItemPostType> = {
        title: nameEditInput.value,
        color: colorInput.value,
      }
      parent.style.backgroundColor = colorInput.value
      parent.style.color = setColorContrast(colorParent)
      colorInputText.style.color = setColorContrast(colorParent)
      target.textContent = 'edit'
      patchCategory(parent.id, newDataCategory)
    }
  } else if (target.dataset.action === 'remove-category') {
    parent.remove()
    deleteCategory(parent.id)
  }
})

const addNewCategory = async () => {
  if (categoryNameInput.value.trim()) {
    const categoryName = categoryNameInput.value
    const categoryPostType: CategoryItemPostType = {
      title: categoryName,
      color: categoryColorInput.value,
    }
    const addedCategory = await postNewCategory(categoryPostType)
    if (!addedCategory) return
    const categoryEl = createCategoryEle(categoryItemTemplate, addedCategory)
    categoriesElsContainer.insertAdjacentElement('afterbegin', categoryEl)
    categoryNameInput.value = ''
  }
}

addCategoryButton.addEventListener('click', addNewCategory)
categoryNameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addNewCategory()
  }
})
categoryColorInputText.value = categoryColorInput.value
categoryColorInput.addEventListener('input', () => {
  categoryColorInputText.value = categoryColorInput.value
})
categoryColorInputText.addEventListener('blur', () => {
  categoryColorInput.value = categoryColorInputText.value
})
window.addEventListener('DOMContentLoaded', async () => {
  const tasks = await getTask()
  setTasksArr(tasks)
  for (const task of tasksArr) {
    todosContainer.insertAdjacentElement(
      'afterbegin',
      createTaskEl(todoTemplate, task),
    )
  }
  const categories = await getCategories()
  for (const category of categories) {
    const categoryEl = createCategoryEle(categoryItemTemplate, category)
    categoriesElsContainer.appendChild(categoryEl)
  }
  checkMessageOverdue(overdueContainer)
  console.log('Task list is loaded!')
})

console.log('Hello from typescript')
