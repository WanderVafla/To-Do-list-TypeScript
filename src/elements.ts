import type { CategoryItemType, Task } from './types'
import { getDaysDueDiff, isColorLight } from './utils'

/* 
  Template is in index.html with id="todo-template"

  Result after function:
  <div class="todo-element" id="crypto.randomUUID()" data-completed="boolean", data-urgency="(critical | high | medium | low)?">
    <label class="todo-element__label">
      <input type="checkbox" name="task-checkbox">
      <span class="todo-element__text"></span>
    </label>
    <button type="button" data-action="remove">Remove</button>
    <p class="due-date">
      <date datetime="date">date
    </p>
  </div>
*/
export const createTaskEl = (
  template: HTMLTemplateElement,
  task: Task,
): HTMLDivElement => {
  const clonTemp = template.content.cloneNode(true) as DocumentFragment
  const borderTodoParent = clonTemp.querySelector<HTMLDivElement>('.border-todo-element')
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taskTextSpan = clonTemp.querySelector<HTMLSpanElement>(
    '.todo-element__text',
  )
  const dueDateP = clonTemp.querySelector<HTMLParagraphElement>('.due-date')
  const checkbox = clonTemp.querySelector<HTMLInputElement>(
    '[name="task-checkbox"]',
  )
  if (!borderTodoParent || !taskTextSpan || !parentDiv || !checkbox || !dueDateP) {
    throw new Error('Warning some html of todo-template are missing')
  }
  parentDiv.id = task.id.toString()
  parentDiv.dataset.completed = String(task.done)
  checkbox.checked = task.done
  taskTextSpan.textContent = task.title
  if (task.due_date) {
    const dateEl = document.createElement('time')
    dateEl.dateTime = task.due_date
    dateEl.textContent = task.due_date
    dueDateP.appendChild(dateEl)

    const diffDays = getDaysDueDiff(task.due_date)
    if (diffDays) {
      if (diffDays < 0) {
        parentDiv.dataset.urgency = 'critical'
      } else if (diffDays === 0 || diffDays === 1) {
        parentDiv.dataset.urgency = 'high'
      } else if (diffDays >= 2 && diffDays <= 4) {
        parentDiv.dataset.urgency = 'medium'
      } else {
        parentDiv.dataset.urgency = 'low'
      }
    }
  } else {
    dueDateP.textContent = 'no due date'
  }

  return borderTodoParent
}

export const createCategoryEle = (
  template: HTMLTemplateElement,
  categoryItemType: CategoryItemType,
): HTMLSpanElement => {
  const clonTemp = template.content.cloneNode(true) as DocumentFragment
  const container = clonTemp.querySelector<HTMLSpanElement>('.category-element')
  const title = clonTemp.querySelector<HTMLParagraphElement>('.category-name')
  const colorInput = clonTemp.querySelector<HTMLInputElement>(
    '.category-color-input',
  )
  if (!title || !colorInput || !container) {
    throw new Error('Error when creating category element')
  }
  container.id = categoryItemType.id.toString()
  title.textContent = categoryItemType.title
  container.style.backgroundColor = categoryItemType.color
  if (isColorLight(container.style.backgroundColor)) {
    container.style.color = 'black'
  } else {
    container.style.color = 'white'
  }

  return container
}

export const createCategoryTodoItemEle = (
  categoty: CategoryItemType,
): HTMLSpanElement => {
  const categoryItem = document.createElement('span') as HTMLSpanElement
  categoryItem.textContent = categoty.title
  categoryItem.id = categoty.id.toString()
  categoryItem.className = 'category-item-element'
  categoryItem.style.backgroundColor = categoty.color
  return categoryItem
}
