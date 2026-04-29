export interface TaskPostType {
  title: string
  content: string
  due_date: string | null
  done: boolean
}

export interface Task extends TaskPostType {
  id: number
}
// Database give auto id
