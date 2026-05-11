import './style.css'

import {
  deleteAllTask,
  deleteCategory,
  deleteCategoryTodo,
  deleteTask,
  patchCategory,
  patchTask,
} from './api'
import {
  BUTTON_ACTION,
  CATEGORY,
  ERRORS,
  LOG_MESSAGE,
  NAME_CLASS_HIDING_ELEMENTS,
  REGEX,
  TEXT_BUTTONS,
} from './constants'
import {
  createCategoryEle,
  createCategoryTodoItemEle,
  createTaskEl,
} from './elements'
import {
  addNewCategory,
  addTask,
  categories,
  categoriesTodos,
  checkMessageOverdue,
  setColorCategoryToTask,
  setTaskCategory,
  tasksArr,
  updateCategories,
  updateCategoriesTodos,
  updateTasksArr,
} from './taskManager'
import type {
  CategoryArguments,
  CategoryItemPostType,
  TaskArguments,
  TaskPostType,
} from './types'
import { getCurrentDate, rgbToHex, setColorContrast } from './utils'

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
const choiceCategoryDialog = document.querySelector<HTMLDialogElement>(
  '#choice-category-dialog',
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
  !categoryColorInputText ||
  !choiceCategoryDialog
) {
  throw new Error(ERRORS.DOM.RootNotFound)
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
todosContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLButtonElement
  const border = target.closest<HTMLDivElement>('.border-todo-element')
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (!parent || !border) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  if (target.dataset.action === BUTTON_ACTION.remove) {
    border.remove()
    deleteTask(parent.id.toString()).then((_) => updateTasksArr())
    checkMessageOverdue(overdueContainer)
  } else if (target.dataset.action === BUTTON_ACTION.choice_category) {
    const categoriesItemContainer =
      choiceCategoryDialog.querySelector<HTMLDivElement>(
        '#task-category-container',
      )
    if (!categoriesItemContainer) {
      throw new Error(ERRORS.DOM.ContainerNotFound)
    }
    if (choiceCategoryDialog.open) {
      categoriesItemContainer.querySelectorAll('*').forEach((element) => {
        element.remove()
      })
      choiceCategoryDialog.close()
      return
    }
    choiceCategoryDialog.dataset.task = parent.id
    const selectedCategories = categoriesTodos.filter(
      (item) => item.todo_id === Number(choiceCategoryDialog.dataset.task),
    )
    for (const category of categories) {
      const categoryEle = createCategoryTodoItemEle(category)
      const foundCategory = selectedCategories.find(
        (item) => item.category_id === category.id,
      )
      if (selectedCategories && foundCategory) {
        categoryEle.dataset.choiced = CATEGORY.DATASET.choiced
      }
      categoriesItemContainer.insertAdjacentElement('afterbegin', categoryEle)
    }
    choiceCategoryDialog.show()
  }
})

choiceCategoryDialog.addEventListener('click', (event) => {
  const target = event.target as HTMLSpanElement
  if (target && target.dataset.choiced !== CATEGORY.DATASET.choiced) {
    setTaskCategory(
      Number(target.id),
      Number(choiceCategoryDialog.dataset.task),
    )

    return
  }
  deleteCategoryTodo(
    Number(target.id),
    Number(choiceCategoryDialog.dataset.task),
  )
  return
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

let activeTextColorHandler: () => void
let activeInputColorHandler: () => void

categoriesElsContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  const parent = target.closest<HTMLSpanElement>('.category-element')
  if (!parent) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  const editDiv = parent.querySelector<HTMLDivElement>('.edit-container')
  const nameCategory =
    parent.querySelector<HTMLParagraphElement>('.category-name')
  if (target.dataset.action === BUTTON_ACTION.edit) {
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
      throw new Error(ERRORS.DOM.ContainerNotFound)
    }
    let colorParent = parent.style.backgroundColor
    // const changeTextColor = () => (colorInputText.value = colorInput.value)
    // const changeInputColor = () => {
    //   if (REGEX.HEX.test(colorInputText.value)) {
    //     colorInput.value = colorInputText.value
    //     return
    //   }
    //   colorInputText.value = rgbToHex(colorParent)
    // }

    if (!parent.classList.contains(NAME_CLASS_HIDING_ELEMENTS)) {
      activeTextColorHandler = () => (colorInputText.value = colorInput.value)
      activeInputColorHandler = () => {
        if (REGEX.hex.test(colorInputText.value)) {
          colorInput.value = colorInputText.value
          return
        }
        colorInputText.value = rgbToHex(colorParent)
      }
      // Set the paramettre of edit container
      target.textContent = TEXT_BUTTONS.saveButton
      colorInput.value = `#${rgbToHex(colorParent)}`
      colorInputText.value = `#${rgbToHex(colorParent)}`
      nameEditInput.value = nameCategory.textContent
      colorInputText.style.color = setColorContrast(colorParent)
      parent.style.color = setColorContrast(colorParent)
      colorInput.addEventListener('input', activeTextColorHandler)
      colorInputText.addEventListener('focusout', activeInputColorHandler)
      parent.classList.add(NAME_CLASS_HIDING_ELEMENTS)

      return
    }

    // Update container after saving the changements
    colorInput.removeEventListener('input', activeTextColorHandler)
    colorInputText.removeEventListener('focusout', activeInputColorHandler)
    parent.classList.remove(NAME_CLASS_HIDING_ELEMENTS)
    nameCategory.textContent = nameEditInput.value
    if (REGEX.hex.test(colorInputText.value)) {
      const newDataCategory: Partial<CategoryItemPostType> = {
        title: nameEditInput.value,
        color: colorInput.value,
      }
      parent.style.backgroundColor = colorInput.value
      // Update variable
      colorParent = parent.style.backgroundColor
      parent.style.color = setColorContrast(colorParent)
      colorInputText.style.color = setColorContrast(colorParent)
      target.textContent = TEXT_BUTTONS.editButton
      patchCategory(parent.id, newDataCategory)
    }
  } else if (target.dataset.action === BUTTON_ACTION.remove) {
    parent.remove()
    deleteCategory(parent.id)
  }
})
// DOM elements that we need to create new category item
const categoryArguments: CategoryArguments = {
  categoryItemTemplate,
  categoryNameInput,
  categoryColorInput,
  categoriesElsContainer,
}

addCategoryButton.addEventListener('click', () =>
  addNewCategory(categoryArguments),
)
categoryNameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addNewCategory(categoryArguments)
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
  await updateTasksArr()
  await updateCategories()
  await updateCategoriesTodos()
  for (const category of categories) {
    const categoryEl = createCategoryEle(categoryItemTemplate, category)
    categoriesElsContainer.appendChild(categoryEl)
  }
  for (const task of tasksArr) {
    const taskEle = createTaskEl(todoTemplate, task)
    setColorCategoryToTask(taskEle.border, Number(taskEle.parent.id))
    todosContainer.insertAdjacentElement('afterbegin', taskEle.border)
  }
  checkMessageOverdue(overdueContainer)
  console.log(LOG_MESSAGE.task_loaded)
})

console.log(LOG_MESSAGE.loaded_typescript)
