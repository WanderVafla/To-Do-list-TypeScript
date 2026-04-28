export interface Task {
  id: number
  title: string
  content: string
  due_date: string,
  done: boolean
}

export interface TaskPostType {
  title: string
  content: string
  due_date: string | null,
  done: boolean
}

export interface UpdateTaskData {
  title?: string
  content?: string
  due_date?: string | null,
  done?: boolean
}