import './style.css'

const input = document.querySelector<HTMLInputElement>('#todo-input')
const sendButton = document.querySelector('#add-todo-button')
const todosContainer = document.querySelector('#todo-elements')
const temp = document.querySelector<HTMLTemplateElement>('#todo-template')


if (!input || !sendButton || !todosContainer || !temp) {
  throw new Error('Warning some html are missing')
}
const tasksArr: Task[] = []
interface Task {
  id: string
  name: string
  completed: boolean
}
/* 
  Template are in index.html with id="todo-template"

  Result after function are:
  <div class="todo-element" id="crypto.randomUUID()" data-completed=(boolen)">
    <div>
      <input type="checkbox" name="task-checkbox">
      <span id="task-text"></span>
    </div>
    <button type="button">Remove</button>
  </div>
*/
const createTaskEll = (
  name: string,
  id: string,
  completed = false,
): HTMLDivElement => {
  const clonTemp = temp.content.cloneNode(true) as DocumentFragment
  const parentDiv = clonTemp.querySelector<HTMLDivElement>('.todo-element')
  const taksTextSpan = clonTemp.querySelector<HTMLSpanElement>('#task-text')
  const checkbox = clonTemp.querySelector<HTMLInputElement>('[name="task-checkbox"]')
  if (!taksTextSpan || !parentDiv || !checkbox) {
    throw new Error("Warning some html of todo-template are missing")
  }
  parentDiv.id = id
  parentDiv.dataset.completed = String(completed)
  checkbox.checked = completed
  taksTextSpan.textContent = name

  console.log(clonTemp);
  return parentDiv
}

const addTask = () => {
  if (!input.value.trim()) {
    alert('Your task is empty!')
    input.value = ''
    return
  }
  // result ${string}-${string}-${string}-${string}-${string}
  const id = crypto.randomUUID()
  todosContainer.insertAdjacentElement(
    'afterbegin',
    createTaskEll(input.value, id),
  )
  tasksArr.push({
    id: id,
    name: input.value,
    completed: false,
  })
  updateStorage('Tasks', JSON.stringify(tasksArr))

  input.value = ''
}
const updateStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}
sendButton.addEventListener('click', addTask)
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask()
  }
})
todosContainer.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement
  const parent = target.closest<HTMLDivElement>('.todo-element')
  if (parent) {
    const task = tasksArr.find((task) => task.id === parent.id)
    if (task) {
      task.completed = target.checked
      parent.dataset.completed = String(target.checked)
      updateStorage('Tasks', JSON.stringify(tasksArr))
      console.log(task)
    }
  }
})


window.addEventListener('DOMContentLoaded', () => {
  const savedTasks: string | null = localStorage.getItem('Tasks')
  if (savedTasks) {
    const jsonTasks = JSON.parse(savedTasks) as Task[]
    for (const task of jsonTasks) {
      todosContainer.insertAdjacentElement(
        'afterbegin',
        createTaskEll(task.name, task.id, task.completed),
      )
      tasksArr.push(task)
    }
  }
})

console.log('Hello from typescript')
