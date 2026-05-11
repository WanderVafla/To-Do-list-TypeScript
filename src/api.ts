import type {
  CategoryItemPostType,
  CategoryItemType,
  CategoryTodoType,
  Task,
  TaskPostType,
} from './types'

const todoUrl = 'https://api.todos.in.jt-lab.ch/todos'
const categoryUrl = 'https://api.todos.in.jt-lab.ch/categories'
const categoriesTodosUrl = 'https://api.todos.in.jt-lab.ch/categories_todos'

export async function getTask(): Promise<Task[]> {
  try {
    const request = await fetch(`${todoUrl}?order=id.asc`, { method: 'GET' })
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
    const urlId = `${todoUrl}?id=eq.${id}`
    const request = await fetch(urlId, {
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
    const urlId = `${todoUrl}?id=eq.${id}`

    const request = await fetch(urlId, {
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

export async function getCategories(): Promise<CategoryItemType[]> {
  try {
    const request = await fetch(`${categoryUrl}?order=id.desc`, {
      method: 'GET',
    })
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
    const urlId = `${categoryUrl}?id=eq.${id}`
    const request = await fetch(urlId, {
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

export async function postNewCategory(categoryPostType: CategoryItemPostType) {
  try {
    const request = await fetch(categoryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(categoryPostType),
    })

    if (!request.ok) {
      throw new Error('Error POST request!')
    }
    if (request.status === 201) {
      if (request.body) {
        const newItem: CategoryItemType = await request.json()
        return Array.isArray(newItem) ? newItem[0] : newItem
      }
      return
    }
  } catch (error) {
    console.error(error)
  }
}

export async function patchCategory(
  id: string,
  categoryUpdate: Partial<CategoryItemPostType>,
) {
  try {
    const urlId = `${categoryUrl}?id=eq.${id}`

    const request = await fetch(urlId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryUpdate),
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

export async function getCategoriesTodos(): Promise<CategoryTodoType[]> {
  try {
    const request = await fetch(categoriesTodosUrl, {
      method: 'GET',
    })
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

export async function deleteCategoryTodo(category_id: number, todo_id: number) {
  try {
    const urlId = `${categoriesTodosUrl}?category_id=eq.${category_id}&todo_id=eq.${todo_id}`
    const request = await fetch(urlId, {
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


export async function postNewCategoryTodo(categoryTodoType: CategoryTodoType) {
  try {
    const request = await fetch(categoriesTodosUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(categoryTodoType),
    })

    if (!request.ok) {
      throw new Error('Error POST request!')
    }
    if (request.status === 201) {
      if (request.body) {
        const newItem: CategoryTodoType = await request.json()
        return Array.isArray(newItem) ? newItem[0] : newItem
      }
      return
    }
  } catch (error) {
    console.error(error)
  }
}
