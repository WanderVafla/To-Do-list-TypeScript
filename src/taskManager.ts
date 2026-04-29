import { getTask, postTask } from './api'
import { createTaskEll } from './elements'
import type { Task, TaskPostType } from './types'
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
    const diffDays = getDaysDueDiff(task.due_date)
    if (task.done === false && diffDays !== null && diffDays < 0) {
      text += `${task.title}\n`
    }
  }
  overdueContainer.textContent = text
}

export interface TaskArguments {
  input: HTMLInputElement
  todosContainer: HTMLDivElement
  todoTemplate: HTMLTemplateElement
  dateInput: HTMLInputElement
  overdueContainer: HTMLParagraphElement
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
  // result ${string}-${string}-${string}-${string}-${string}
  // const id = crypto.randomUUID()
  const addedItem: Task | undefined = await postTask(task)
  if (!addedItem) {
    return console.error("Item is undefined!")
  }

  args.todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEll(args.todoTemplate, addedItem),
  )
  checkMessageOverdue(args.overdueContainer)

  args.input.value = ''
}
