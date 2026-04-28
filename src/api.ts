import type { Task, TaskPostType, UpdateTaskData } from './types'

const url = 'https://api.todos.in.jt-lab.ch/todos'

export async function getTask(): Promise<Task[]> {
  try {
    const request = await fetch(url, { method: 'GET' })
    if (!request.ok) {
      throw new Error('Error GET request!')
    }
    const response = await request.json()
    console.log(response)
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
        accept: 'application/json',
      },
      body: JSON.stringify(task),
    })
    if (!request.ok) {
      throw new Error('Error POST request!')
    }
    if (request.status === 201) {
      return
    }
  } catch (error) {
    console.error(error)
  }
}

export async function deleteTask(id?: string) {
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

export async function patchTask(id: string, taskUpdate: UpdateTaskData) {
  try {
    const urdId = `${url}?id=eq.${id}`
    console.log(urdId)

    const request = await fetch(urdId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskUpdate),
    })
    if (request.status === 204) {
      console.log('Toggled')
      return
    }
    const response = await request.json()
    console.error(response)
  } catch (error) {
    console.error(error)
  }
}
