import { getCategories, getCategoriesTodos, getTask, postNewCategory, postNewCategoryTodo, postTask } from './api'
import { createCategoryEle, createTaskEl } from './elements'
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

export async function updateCotegories() {
  categories = await getCategories()
  
}

export const updateCategoriesTodos = async () => {
  categoriesTodos = await getCategoriesTodos()
  
}

export const getItemCategoriesTodos = (id: number): CategoryTodoType | undefined => {
  return categoriesTodos.find(item => item.todo_id === id || item.category_id === id ? item : '')
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
    const categoryEl = createCategoryEle(
      categoryArguments.categoryItemTemplate,
      addedCategory,
    )
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

export const setBorderColorTask = () => {

}

export function setColorCatergoryToTask(task: Task, template: HTMLTemplateElement): HTMLElement {
  const taskEle = createTaskEl(template, task)
  const targetTodoId = categoriesTodos.filter(item => item.todo_id === task.id)
    if (targetTodoId.length > 0) {
      // console.log(targetTodoId)
      
      const targetCategory = categories.find(item => item.id === targetTodoId[0].category_id)
      if (targetCategory) {
        // console.log(targetCategory);
        
        taskEle.style.borderColor = targetCategory.color

        const buttonChoiceCategory = taskEle.querySelector<HTMLButtonElement>('button[data-action="choice-category"]')
        if (buttonChoiceCategory) {
          buttonChoiceCategory.textContent = targetCategory.title
        }
      }
    } else if (targetTodoId.length > 1) {
      const deiveseColors = 100 / targetTodoId.length
      const colors: string[] = []
      for (const todoId of targetTodoId) {
        const categoryItem = categories.find(item => item.id === todoId.category_id)
        if (categoryItem) {
          colors.push(categoryItem.color)
        }
      }
      taskEle.style.border = 'linear-gradient(90deg,rgba(103, 184, 219, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)'
      console.log(colors);
      
      // const targetCategory = categories.forEach(item => {
      //   if (item.id === )
      // })
    }
    return taskEle
}