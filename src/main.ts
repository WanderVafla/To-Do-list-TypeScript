import './style.css'

import {
  deleteAllTask,
  deleteCategory,
  deleteTask,
  getCategories,
  getTask,
  patchCategorie,
  patchTask,
  postNewCategorie,
} from './api'
import { createCategorieEle, createTaskEll } from './elements'
import {
  addTask,
  checkMessageOverdue,
  setTasksArr,
  tasksArr,
  updateTasksArr,
} from './taskManager'
import type {
  CategoryItemPostType,
  TaskArguments,
  TaskPostType,
} from './types'
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
const categorieItemTemplate = document.querySelector<HTMLTemplateElement>(
  '#categorie-element-template',
)
const addCategorieButton = document.querySelector<HTMLButtonElement>(
  '#add-categorie-button',
)
const categorieNameInput = document.querySelector<HTMLInputElement>(
  '#category-name-input',
)
const categoryColorInput = document.querySelector<HTMLInputElement>(
  '#category-color-input',
)
// const categoryColorText = document.querySelector<HTMLLabelElement>(
//   'label[for="category-color-input"]',
// )
const categoryColorText = document.querySelector<HTMLLabelElement>(
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
  !categorieItemTemplate ||
  !addCategorieButton ||
  !categorieNameInput ||
  !categoryColorInput ||
  !categoryColorText
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
  Visisbility of categorie elements when you change name of color
  there is two hided containers for each categorie item 
  firs: for change color
  second: for chenge name

  parent: for hide all elements into categorie item
  container: for do visible container what we need
  buttonTarget: button action we need them for toggle state
  hideOptionel: other container what we not want to hide
  */
const toggleVisibilityEls = (
  parent: HTMLElement,
  container: HTMLElement,
  buttonTarget: HTMLButtonElement,
  hideOpionel?: HTMLElement,
): boolean => {
  const children = parent.querySelectorAll<HTMLElement>('*')
  const parentTarget = buttonTarget.parentElement
  if (container.style.display === 'none') {
    buttonTarget.textContent = 'save'

    children.forEach((element) => {
      if (element !== buttonTarget) {
        if (parentTarget !== parent && element !== parentTarget) {
          element.style.display = 'none'
        }
      }
    })
    container.style.removeProperty('display')
    container.querySelectorAll<HTMLElement>('*').forEach((element) => {
      element.style.removeProperty('display')
    })
    return true
  }
  children.forEach((element) => {
    element.style.removeProperty('display')
  })
  container.style.display = 'none'
  if (hideOpionel) {
    hideOpionel.style.display = 'none'
  }
  return false
}

categoriesElsContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  const parent = target.closest<HTMLSpanElement>('.categorie-element')
  if (!parent) {
    throw new Error('Error parent container')
  }
  const colorEditDiv = parent.querySelector<HTMLDivElement>(
    '.color-edit-container',
  )
  const nameEditDiv = parent.querySelector<HTMLDivElement>(
    '.name-edit-container',
  )
  if (target.dataset.action === 'edit-color') {
    const colorInput = parent.querySelector<HTMLInputElement>(
      '.category-color-input',
    )
    const colorText = parent.querySelector<HTMLParagraphElement>(
      '.category-color-text',
    )
    if (!colorInput || !colorEditDiv || !colorText || !nameEditDiv) {
      throw new Error('Error color input')
    }
    const regexHex = /^#?([A-Fa-f0-9]{2}){3}$/
    const changeInputColor = () => (colorText.textContent = colorInput.value)
    const changeTextColor = () => {
      if (regexHex.test(colorText.textContent)) {
        colorInput.value = colorText.textContent
      }
    }
    const visibility = toggleVisibilityEls(
      parent,
      colorEditDiv,
      target,
      nameEditDiv,
    )
    if (visibility) {
      target.textContent = 'save'
      colorInput.value = `#${rgbToHex(parent.style.backgroundColor)}`
      colorText.textContent = `#${rgbToHex(parent.style.backgroundColor)}`
      colorInput.addEventListener('input', changeInputColor)
      colorText.addEventListener('focusout', () => changeTextColor)
      return
    }

    colorInput.removeEventListener('input', changeInputColor)
    colorText.removeEventListener('focusout', changeTextColor)

    target.textContent = 'edit'
    if (regexHex.test(colorText.textContent)) {
      console.log('a')

      const newColor: Partial<CategoryItemPostType> = {
        color: colorInput.value,
      }
      parent.style.backgroundColor = colorInput.value
      if (isColorLight(parent.style.backgroundColor)) {
        parent.style.color = 'black'
      } else {
        parent.style.color = 'white'
      }
      patchCategorie(parent.id, newColor)
    }
  } else if (target.dataset.action === 'remove-categorie') {
    parent.remove()
    deleteCategory(parent.id)
  } else if (target.dataset.action === 'rename-categorie') {
    const nameEditInput = parent.querySelector<HTMLInputElement>(
      '.category-name-input',
    )
    const nameCategorie =
      parent.querySelector<HTMLParagraphElement>('.categorie-name')
    if (!nameEditDiv || !nameEditInput || !nameCategorie || !colorEditDiv) {
      throw new Error('Error rename input')
    }
    const visibility = toggleVisibilityEls(
      parent,
      nameEditDiv,
      target,
      colorEditDiv,
    )
    if (visibility) {
      target.textContent = 'save'
      nameEditInput.value = nameCategorie.textContent
      return
    }
    const newName: Partial<CategoryItemPostType> = {
      title: nameEditInput.value,
    }
    nameCategorie.textContent = nameEditInput.value
    patchCategorie(parent.id, newName)
  }
})

const addNewCategory = async () => {
  if (categorieNameInput.value.trim()) {
    const categorieName = categorieNameInput.value
    const categoriePostType: CategoryItemPostType = {
      title: categorieName,
      color: categoryColorInput.value,
    }
    const addedCategorie = postNewCategorie(categoriePostType)
    const categorieEl = createCategorieEle(
      categorieItemTemplate,
      await addedCategorie,
    )
    categoriesElsContainer.appendChild(categorieEl)
    categorieNameInput.value = ''
  }
}

addCategorieButton.addEventListener('click', addNewCategory)
categorieNameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addNewCategory()
  }
})
categoryColorText.textContent = categoryColorInput.value
categoryColorInput.addEventListener('input', () => {
  categoryColorText.textContent = categoryColorInput.value
})
categoryColorText.addEventListener('blur', () => {
  categoryColorInput.value = categoryColorText.textContent
})
window.addEventListener('DOMContentLoaded', async () => {
  const tasks = await getTask()
  setTasksArr(tasks)
  for (const task of tasksArr) {
    todosContainer.insertAdjacentElement(
      'afterbegin',
      createTaskEll(todoTemplate, task),
    )
  }
  const categories = await getCategories()
  for (const category of categories) {
    const categorieEl = createCategorieEle(categorieItemTemplate, category)
    categoriesElsContainer.appendChild(categorieEl)
  }
  checkMessageOverdue(overdueContainer)
  console.log('Task list is loaded!')
})

console.log('Hello from typescript')
