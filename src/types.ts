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

export interface CategorieItemPostType {
  title: string
  color: string
}

// Database give auto id
export interface CategorieItemType extends CategorieItemPostType {
  id: number
}

export interface TaskArguments {
  input: HTMLInputElement
  todosContainer: HTMLDivElement
  todoTemplate: HTMLTemplateElement
  dateInput: HTMLInputElement
  overdueContainer: HTMLParagraphElement
}
