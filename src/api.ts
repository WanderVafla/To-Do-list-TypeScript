import type { Task, TaskPostType } from './types'

const url = 'https://api.todos.in.jt-lab.ch/todos'

export async function getTask(): Promise<Task[]> {
  try {
    const request = await fetch(url, { method: 'GET' })
    if (!request.ok) {
      throw new Error('Error GET request!')
    }
    const response = await request.json()
    return response
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function postTask(task: TaskPostType) {
  try {
    const request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(task),
    })

    if (!request.ok) {
      throw new Error('Error POST request!')
    }
    if (request.status === 201) {
      if (request.body) {
        const newItem: Promise<Task> = await request.json()
        return Array.isArray(newItem) ? newItem[0] : newItem
      }
      return
    }
  } catch (error) {
    console.error(error)
  }
}

export async function deleteTask(id: string) {
  try {
    let urdId = `${url}?id=eq.${id}`
    if (!id) {
      urdId = url
    }
    const request = await fetch(urdId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (request.status === 204) {
      return
    }
    const errorData = await request.json()
    console.error(errorData)
  } catch (error) {
    console.error(error)
  }
}

export async function deleteAllTask() {
  try {
    const request = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (request.status === 204) {
      return
    }
    const errorData = await request.json()
    console.error(errorData)
  } catch (error) {
    console.error(error)
  }
}

export async function patchTask(id: string, taskUpdate: Partial<TaskPostType>) {
  try {
    const urdId = `${url}?id=eq.${id}`

    const request = await fetch(urdId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskUpdate),
    })
    if (request.status === 204) {
      return
    }
    const response = await request.json()
    console.error(response)
  } catch (error) {
    console.error(error)
  }
}
