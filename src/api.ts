import type {
  CategoryItemPostType,
  CategorieItemType,
  Task,
  TaskPostType,
} from './types'

const todoUrl = 'https://api.todos.in.jt-lab.ch/todos'
const categorieUrl = 'https://api.todos.in.jt-lab.ch/categories'

export async function getTask(): Promise<Task[]> {
  try {
    const request = await fetch(todoUrl, { method: 'GET' })
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
    const request = await fetch(todoUrl, {
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
    const urdId = `${todoUrl}?id=eq.${id}`
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
    const request = await fetch(todoUrl, {
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
    const urdId = `${todoUrl}?id=eq.${id}`

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

export async function getCategories(): Promise<CategorieItemType[]> {
  try {
    const request = await fetch(categorieUrl, { method: 'GET' })
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

export async function deleteCategory(id: string) {
  try {
    const urdId = `${categorieUrl}?id=eq.${id}`
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

export async function postNewCategorie(
  categoriePostType: CategoryItemPostType,
) {
  try {
    const request = await fetch(categorieUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(categoriePostType),
    })

    if (!request.ok) {
      throw new Error('Error POST request!')
    }
    if (request.status === 201) {
      if (request.body) {
        const newItem: CategorieItemType = await request.json()
        return Array.isArray(newItem) ? newItem[0] : newItem
      }
      return
    }
  } catch (error) {
    console.error(error)
  }
}

export async function patchCategorie(
  id: string,
  categorieUpdate: Partial<CategoryItemPostType>,
) {
  try {
    const urdId = `${categorieUrl}?id=eq.${id}`

    const request = await fetch(urdId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categorieUpdate),
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
