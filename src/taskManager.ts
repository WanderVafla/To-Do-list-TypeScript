import { getTask, postTask } from './api'
import { createTaskEll } from './elements'
import type { Task, TaskArguments, TaskPostType } from './types'
import { getDaysDueDiff } from './utils'
/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
export let tasksArr: Task[] = []

// export interface Task {
//   id: string
//   name: string
//   completed: boolean
//   due: string
// }

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
    createTaskEll(args.todoTemplate, addedItem),
  )
  checkMessageOverdue(args.overdueContainer)

  args.input.value = ''
}

export const rgbToHex = (rgb: string): string => {
  const regex = /\d{1,3}.\s\d{1,3}.\s\d{1,3}/g
  const parsetColorRgb = String(regex.exec(rgb))
    .split(', ')
    .map((color) =>
      Number(color).toString(16).length === 1
        ? `0${Number(color).toString(16)}`
        : Number(color).toString(16),
    )
    .join('')
  return parsetColorRgb
}
