import { createTaskEll } from './elements'
import { getDaysDueDiff } from './utils'

/* 
  A current day and month should always be in a two-digit format: 
  result: 2026-2-5 > 2026-02-05
*/
export let tasksArr: Task[] = []
export interface Task {
  id: string
  name: string
  completed: boolean
  due: string
}

export const setTasksArr = (array: Task[]) => {
  tasksArr = array
}

export const updateStorage = (overdueContainer: HTMLParagraphElement) => {
  localStorage.setItem('Tasks', JSON.stringify(tasksArr))
  checkMessageOverdue(overdueContainer)
}

export const checkMessageOverdue = (overdueContainer: HTMLParagraphElement) => {
  let text = ''
  for (const task of tasksArr) {
    const diffDays = getDaysDueDiff(task.due)
    if (task.completed === false && diffDays < 0) {
      text += `${task.name}\n`
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

export const addTask = (args: TaskArguments) => {
  if (!args.input.value.trim()) {
    alert('Your task is empty!')
    args.input.value = ''
    return
  }
  // result ${string}-${string}-${string}-${string}-${string}
  const id = crypto.randomUUID()

  args.todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEll(
      args.todoTemplate,
      args.input.value,
      id,
      args.dateInput.value,
    ),
  )
  tasksArr.push({
    id: id,
    name: args.input.value,
    completed: false,
    due: args.dateInput.value,
  })
  updateStorage(args.overdueContainer)

  args.input.value = ''
}
