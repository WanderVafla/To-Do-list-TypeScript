import { COLOR, DOM_ELEMENT, ERRORS, TASK } from './constants'
import type { CategoryItemType, Task } from './types'
import { getDaysDueDiff, setColorContrast } from './utils'

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
): { border: HTMLDivElement; parent: HTMLDivElement } => {
  const clonTemp = template.content.cloneNode(true) as DocumentFragment
  const borderTodoParent = clonTemp.querySelector<HTMLDivElement>(
    '.border-todo-element',
  )
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taskTextSpan = clonTemp.querySelector<HTMLSpanElement>(
    '.todo-element__text',
  )
  const dueDateP = clonTemp.querySelector<HTMLParagraphElement>('.due-date')
  const checkbox = clonTemp.querySelector<HTMLInputElement>(
    '[name="task-checkbox"]',
  )
  if (
    !borderTodoParent ||
    !taskTextSpan ||
    !parentDiv ||
    !checkbox ||
    !dueDateP
  ) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  borderTodoParent.style.background = COLOR.default_task_border_color
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
    if (diffDays !== null) {
      if (diffDays < 0) {
        parentDiv.dataset.urgency = TASK.DATASET.URGENCY.critical
      } else if (diffDays === 0 || diffDays === 1) {
        parentDiv.dataset.urgency = TASK.DATASET.URGENCY.high
      } else if (diffDays >= 2 && diffDays <= 4) {
        parentDiv.dataset.urgency = TASK.DATASET.URGENCY.medium
      } else {
        parentDiv.dataset.urgency = TASK.DATASET.URGENCY.low
      }
    }
  } else {
    dueDateP.textContent = TASK.TEXT.no_date
  }

  return { border: borderTodoParent, parent: parentDiv }
}

export const createCategoryEle = (
  categoryItemType: CategoryItemType,
): HTMLSpanElement => {
  const template = document.querySelector<HTMLTemplateElement>(
    '#category-element-template',
  )
  if (!template) {
    throw new Error(ERRORS.DOM.TemplateNotFound)
  }

  const clonTemp = template.content.cloneNode(true) as DocumentFragment
  const container = clonTemp.querySelector<HTMLSpanElement>('.category-element')
  const title = clonTemp.querySelector<HTMLParagraphElement>('.category-name')
  const colorInput = clonTemp.querySelector<HTMLInputElement>(
    '.category-color-input',
  )
  if (!title || !colorInput || !container) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  container.id = categoryItemType.id.toString()
  title.textContent = categoryItemType.title
  container.style.backgroundColor = categoryItemType.color
  container.style.color = setColorContrast(container.style.backgroundColor)

  return container
}

export const createCategoryTodoItemEle = (
  category: CategoryItemType,
): HTMLSpanElement => {
  const categoryItem = document.createElement('span') as HTMLSpanElement
  categoryItem.textContent = category.title
  categoryItem.id = category.id.toString()
  categoryItem.className = DOM_ELEMENT.TODO_CHOICE_CATEGORY.class_name
  categoryItem.style.backgroundColor = category.color
  categoryItem.style.color = setColorContrast(
    categoryItem.style.backgroundColor,
  )

  return categoryItem
}
