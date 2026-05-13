import {
  getCategories,
  getCategoriesTodos,
  getTask,
  postNewCategory,
  postNewCategoryTodo,
  postTask,
} from './api'
import { BUTTON_ACTION, CATEGORY, ERRORS, LOG_MESSAGE } from './constants'
import { choiceCategoryDialog } from './DOMElements'
import {
  createCategoryEle,
  createCategoryTodoItemEle,
  createTaskEl,
} from './elements'
import type {
  CategoryArguments,
  CategoryItemPostType,
  CategoryItemType,
  CategoryTodoType,
  Task,
  TaskArguments,
  TaskPostType,
} from './types'
import { getDaysDueDiff } from './utils'

const overdueContainer =
  document.querySelector<HTMLParagraphElement>('#overdue-message')

/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
export let tasksArr: Task[] = []
export let categories: CategoryItemType[] = []
export let categoriesTodos: CategoryTodoType[] = []

export const setTasksArr = (array: Task[]) => {
  tasksArr = array
}

export const updateTasksArr = async () => {
  tasksArr = await getTask()
}

export async function updateCategories() {
  categories = await getCategories()
}

export const updateCategoriesTodos = async () => {
  categoriesTodos = await getCategoriesTodos()
}

export const getItemCategoriesTodos = (
  id: number,
): CategoryTodoType | undefined => {
  return categoriesTodos.find(
    (item) => item.todo_id === id || item.category_id === id,
  )
}

export const updateStorage = async () => {
  tasksArr = await getTask()
  checkMessageOverdue()
}

export const checkMessageOverdue = () => {
  if (!overdueContainer) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  let text = ''
  for (const task of tasksArr) {
    if (task.due_date) {
      const diffDays = getDaysDueDiff(task.due_date)
      if (task.done === false && diffDays !== null && diffDays < 0) {
        text += `${task.title}\n`
      }
    }
  }
  overdueContainer.textContent = text
}

export const addTask = async (args: TaskArguments) => {
  if (!args.input.value.trim()) {
    alert(LOG_MESSAGE.alert_empty_input)
    args.input.value = ''
    return
  }
  const task: TaskPostType = {
    title: args.input.value,
    content: args.input.value,
    due_date: args.dateInput.value !== '' ? args.dateInput.value : null,
    done: false,
  }

  const addedItem: Task | undefined = await postTask(task)
  if (!addedItem) {
    throw new Error(ERRORS.STATE.StateEmpty)
  }
  updateTasksArr()
  args.todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEl(addedItem).border,
  )
  checkMessageOverdue()

  args.input.value = ''
}

export const addNewCategory = async (categoryArguments: CategoryArguments) => {
  if (categoryArguments.categoryNameInput.value.trim()) {
    const categoryName = categoryArguments.categoryNameInput.value
    const categoryPostType: CategoryItemPostType = {
      title: categoryName,
      color: categoryArguments.categoryColorInput.value,
    }
    const addedCategory = await postNewCategory(categoryPostType)
    if (!addedCategory) return
    const categoryEl = createCategoryEle(addedCategory)
    categoryArguments.categoriesElsContainer.insertAdjacentElement(
      'afterbegin',
      categoryEl,
    )
    categoryArguments.categoryNameInput.value = ''
  }
}

export const setTaskCategory = async (category_id: number, todo_id: number) => {
  const categoryTodoType: CategoryTodoType = {
    category_id,
    todo_id,
  }
  await postNewCategoryTodo(categoryTodoType)
}

export const setBorderColorTask = () => {}

export function setColorCategoryToTask(
  borderElement: HTMLDivElement | HTMLSpanElement,
  id: number,
) {
  // const taskEle = createTaskEl(template, task)
  const targetTodoId = categoriesTodos.filter((item) => item.todo_id === id)
  const buttonChoiceCategory = borderElement.querySelector<HTMLButtonElement>(
    `button[data-action="${BUTTON_ACTION.choice_category}"]`,
  )
  if (!buttonChoiceCategory) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  if (targetTodoId.length === 1) {
    const targetCategory = categories.find(
      (item) => item.id === targetTodoId[0].category_id,
    )
    if (targetCategory) {
      borderElement.style.background = targetCategory.color
      buttonChoiceCategory.textContent = targetCategory.title
    }
  } else if (targetTodoId.length > 1) {
    type colorTitleCategory = {
      color: string
      title: string
    }
    const colorsTitles: colorTitleCategory[] = []
    for (const todoId of targetTodoId) {
      const categoryItem = categories.find(
        (item) => item.id === todoId.category_id,
      )
      if (categoryItem) {
        colorsTitles.push({
          color: categoryItem.color,
          title: categoryItem.title,
        })
      }
    }
    const colors = colorsTitles.map((item) => item.color).join(', ')
    const titles = colorsTitles.map((item) => item.title).join(', ')
    borderElement.style.background = `linear-gradient(to right, ${colors})`
    buttonChoiceCategory.textContent = titles
  }
}

export const closeAllDialogs = () => {
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.close()
  })
}

export const setCategoriesTodoDialogsChoice = async () => {
  await updateCategories()

  console.log('updated')

  if (!choiceCategoryDialog) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  const choiceCategory = choiceCategoryDialog
  const categoriesItemContainer =
    choiceCategoryDialog.querySelector<HTMLDivElement>(
      '#task-category-container',
    )
  if (!categoriesItemContainer) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  categoriesItemContainer.querySelectorAll('*').forEach((element) => {
    element.remove()
  })
  const selectedCategories = categoriesTodos.filter(
    (item) => item.todo_id === Number(choiceCategory.dataset.task),
  )
  categories.forEach((category) => {
    const categoryEle = createCategoryTodoItemEle(category)
    const foundCategory = selectedCategories.find(
      (item) => item.category_id === category.id,
    )
    if (selectedCategories && foundCategory) {
      categoryEle.dataset.choiced = CATEGORY.DATASET.choiced
    }
    categoriesItemContainer.insertAdjacentElement('afterbegin', categoryEle)
  })
}
