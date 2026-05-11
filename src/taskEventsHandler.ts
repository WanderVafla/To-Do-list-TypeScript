import { deleteAllTask, deleteCategoryTodo, deleteTask, patchTask } from './api'
import { BUTTON_ACTION, CATEGORY, ERRORS } from './constants'
import { dateInput, todosContainer } from './DOMElements'
import { createCategoryTodoItemEle } from './elements'
import {
  addTask,
  categories,
  categoriesTodos,
  checkMessageOverdue,
  setTaskCategory,
  tasksArr,
  updateTasksArr,
} from './taskManager'
import type { TaskArguments, TaskPostType } from './types'

const sendButton = document.querySelector<HTMLButtonElement>('#add-todo-button')
const input = document.querySelector<HTMLInputElement>('#todo-input')
// const todosContainer = document.querySelector<HTMLDivElement>('#todo-elements')

const choiceCategoryDialog = document.querySelector<HTMLDialogElement>(
  '#choice-category-dialog',
)
const deleteAllButton = document.querySelector<HTMLButtonElement>('#delete-all')

if (
  !sendButton ||
  !input ||
  !todosContainer ||
  !dateInput ||
  !deleteAllButton ||
  !choiceCategoryDialog
) {
  throw new Error(ERRORS.DOM.RootNotFound)
}

const taskArguments: TaskArguments = {
  input,
  todosContainer,
  dateInput,
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

todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find((task) => task.id.toString() === parent.id)
    if (task) {
      task.done = target.checked
      parent.dataset.completed = String(target.checked)
      const checkboxStatus: Partial<TaskPostType> = { done: task.done }
      checkMessageOverdue()
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
    checkMessageOverdue()
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

deleteAllButton.addEventListener('click', () => {
  if (!todosContainer) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  todosContainer.replaceChildren()
  deleteAllTask().then((_) => updateTasksArr())
  checkMessageOverdue()
})
