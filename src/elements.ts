import { getDaysDueDiff } from './api'

export const createTaskEll = (
  todoTemplate: HTMLTemplateElement,
  name: string,
  id: string,
  due: string,
  completed = false,
): HTMLDivElement => {
  const clonTemp = todoTemplate.content.cloneNode(true) as DocumentFragment
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taskTextSpan = clonTemp.querySelector<HTMLSpanElement>(
    '.todo-element__text',
  )
  const dueDateP = clonTemp.querySelector<HTMLParagraphElement>('.due-date')
  const checkbox = clonTemp.querySelector<HTMLInputElement>(
    '[name="task-checkbox"]',
  )
  if (!taskTextSpan || !parentDiv || !checkbox || !dueDateP) {
    throw new Error('Warning some html of todo-template are missing')
  }
  parentDiv.id = id
  parentDiv.dataset.completed = String(completed)
  checkbox.checked = completed
  taskTextSpan.textContent = name
  if (due !== '') {
    const dateEl = document.createElement('time')
    dateEl.dateTime = due
    dateEl.textContent = due
    dueDateP.appendChild(dateEl)

    const diffDays = getDaysDueDiff(due)
    if (diffDays < 0) {
      parentDiv.dataset.urgency = 'critical'
    } else if (diffDays === 0 || diffDays === 1) {
      parentDiv.dataset.urgency = 'high'
    } else if (diffDays >= 2 && diffDays <= 4) {
      parentDiv.dataset.urgency = 'medium'
    } else {
      parentDiv.dataset.urgency = 'low'
    }
  } else {
    dueDateP.textContent = 'no due date'
  }

  return parentDiv
}
