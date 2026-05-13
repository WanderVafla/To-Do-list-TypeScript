export interface TaskPostType {
  title: string
  content: string
  due_date: string | null
  done: boolean
}

// Database give auto id
export interface Task extends TaskPostType {
  id: number
}

export interface CategoryItemPostType {
  title: string
  color: string
}

// Database give auto id
export interface CategoryItemType extends CategoryItemPostType {
  id: number
}

export interface CategoryTodoType {
  category_id: number
  todo_id: number
}

export interface TaskArguments {
  input: HTMLInputElement
  todosContainer: HTMLDivElement
  dateInput: HTMLInputElement
}

export interface CategoryArguments {
  categoryNameInput: HTMLInputElement
  categoryColorInput: HTMLInputElement
  categoriesElsContainer: HTMLDivElement
}
