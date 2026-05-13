import { deleteAllTask, deleteTask, patchTask } from './api'
import { BUTTON_ACTION, CATEGORY, ERRORS } from './constants'
import { choiceCategoryDialog, dateInput, todosContainer } from './DOMElements'
import {
  addTask,
  checkMessageOverdue,
  closeAllDialogs,
  setCategoriesTodoDialogsChoice,
  setTaskCategory,
  tasksArr,
  updateTasksArr,
} from './taskManager'
import type { TaskArguments, TaskPostType } from './types'

const sendButton = document.querySelector<HTMLButtonElement>('#add-todo-button')
const input = document.querySelector<HTMLInputElement>('#todo-input')
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
const choiceCategory = choiceCategoryDialog

const categoriesItemContainer = choiceCategory.querySelector<HTMLDivElement>(
  '#task-category-container',
)
if (!categoriesItemContainer) {
  throw new Error(ERRORS.DOM.ContainerNotFound)
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
    if (!choiceCategory) {
      throw new Error(ERRORS.DOM.ContainerNotFound)
    }
    if (choiceCategory.open) {
      choiceCategory.close()
      return
    }
    choiceCategory.dataset.task = parent.id
    setCategoriesTodoDialogsChoice()
    closeAllDialogs()
    choiceCategory.show()
  }
})

choiceCategory.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  if (target.dataset.action === BUTTON_ACTION.close) choiceCategory.close()
})

categoriesItemContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLSpanElement
  if (!target || !choiceCategoryDialog) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }

  if (target.dataset.choiced !== CATEGORY.DATASET.choiced) {
    setTaskCategory(Number(target.id), Number(choiceCategory.dataset.task))
    return
  }
})

deleteAllButton.addEventListener('click', () => {
  if (!todosContainer) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  todosContainer.replaceChildren()
  deleteAllTask().then((_) => updateTasksArr())
  checkMessageOverdue()
})
