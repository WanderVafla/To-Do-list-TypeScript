export const NAME_CLASS_HIDING_ELEMENTS = 'is-editing-color'

export const REGEX = {
  hex: /^#?([A-Fa-f0-9]{2}){3}$/,
  rgb_only_numbers: /\d{1,3}/g,
}

export const TEXT_BUTTONS = {
  saveButton: 'save',
  editButton: 'edit',
}

export const BUTTON_ACTION = {
  remove: 'remove',
  edit: 'edit',
  close: 'close',
  remove_categoty: 'remove-category',
  choice_category: 'choice-category',
}

export const TASK = {
  DATASET: {
    URGENCY: {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
    },
  },
  TEXT: {
    no_date: 'no due date',
    no_category: 'no category',
  },
}

export const CATEGORY = {
  DATASET: {
    choiced: 'True',
  },
}

export const URLS = {
  todos: 'https://api.todos.in.jt-lab.ch/todos',
  category: 'https://api.todos.in.jt-lab.ch/categories',
  categories_todos: 'https://api.todos.in.jt-lab.ch/categories_todos',
}

export const ERRORS = {
  DOM: {
    ContainerNotFound: 'Required UI container was not found in the DOM',
    RootNotFound: 'Application root element is missing. The app cannot mount',
    TemplateNotFound: 'Template not found',
  },

  API_REQUEST: {
    get: 'Error GET request!',
    post: 'Error POST request!',
  },

  STATE: {
    StateEmpty: 'Type is underfiend',
  },
}

export const LOG_MESSAGE = {
  task_loaded: 'Task list is loaded!',
  loaded_typescript: 'Hello from typescript',
  alert_empty_input: 'Your task is empty!',
}

export const DOM_ELEMENT = {
  TODO_CHOICE_CATEGORY: {
    class_name: 'category-item-element',
  },
}

export const COLOR = {
  CONTRAST: {
    light: 'white',
    dark: 'black',
  },
  default_task_border_color: 'grey',
}
