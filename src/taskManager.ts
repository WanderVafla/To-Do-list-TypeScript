import { getTask, postNewCategory, postTask } from './api'
import { createCategoryEle, createTaskEl } from './elements'
import type { CategoryArguments, CategoryItemPostType, Task, TaskArguments, TaskPostType } from './types'
import { getDaysDueDiff } from './utils'
/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
export let tasksArr: Task[] = []

export const setTasksArr = (array: Task[]) => {
  tasksArr = array
}

export const updateTasksArr = async () => {
  tasksArr = await getTask()
}

export const updateStorage = async (overdueContainer: HTMLParagraphElement) => {
  tasksArr = await getTask()
  checkMessageOverdue(overdueContainer)
}

export const checkMessageOverdue = (overdueContainer: HTMLParagraphElement) => {
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
    alert('Your task is empty!')
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
    return console.error('Item is undefined!')
  }
  updateTasksArr()
  args.todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEl(args.todoTemplate, addedItem),
  )
  checkMessageOverdue(args.overdueContainer)

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
    const categoryEl = createCategoryEle(categoryArguments.categoryItemTemplate, addedCategory)
    categoryArguments.categoriesElsContainer.insertAdjacentElement('afterbegin', categoryEl)
    categoryArguments.categoryNameInput.value = ''
  }
}