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
export interface CategorieItemType extends CategoryItemPostType {
  id: number
}

export interface TaskArguments {
  input: HTMLInputElement
  todosContainer: HTMLDivElement
  todoTemplate: HTMLTemplateElement
  dateInput: HTMLInputElement
  overdueContainer: HTMLParagraphElement
}
