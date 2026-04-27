import { createTaskEll } from './elements'

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

export const getCurrentDate = (): string => {
  const date = new Date()
  const dateYear = date.getFullYear()
  const dateMonth = String(date.getMonth() + 1).padStart(2, '0')
  const dateDay = String(date.getDate()).padStart(2, '0')
  return `${dateYear}-${dateMonth}-${dateDay}`
}

export const updateStorage = (overdueContainer: HTMLParagraphElement) => {
  localStorage.setItem('Tasks', JSON.stringify(tasksArr))
  checkMessageOverdue(overdueContainer)
}

export const getDaysDueDiff = (due: string): number => {
  const targetDate = new Date(due)
  const currentDate = new Date(getCurrentDate())
  const diffTime = targetDate.getTime() - currentDate.getTime()
  // Calculate the difference in days
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const checkMessageOverdue = (overdueContainer: HTMLParagraphElement) => {
  let text = ''
  for (const task of tasksArr) {
    const diffDays = getDaysDueDiff(task.due)
    if (task.completed === false && diffDays < 0) {
      text += `${task.name}\n`
    }
    overdueContainer.textContent = text
  }
}

export const addTask = (
  input: HTMLInputElement,
  todosContainer: HTMLDivElement,
  todoTemplate: HTMLTemplateElement,
  dateInput: HTMLInputElement,
  overdueContainer: HTMLParagraphElement,
) => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }
  // result ${string}-${string}-${string}-${string}-${string}
  const id = crypto.randomUUID()

  todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEll(todoTemplate, input.value, id, dateInput.value),
  )
  tasksArr.push({
    id: id,
    name: input.value,
    completed: false,
    due: dateInput.value,
  })
  updateStorage(overdueContainer)

  input.value = ''
}
