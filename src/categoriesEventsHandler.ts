import { deleteCategory, patchCategory } from './api'
import {
  BUTTON_ACTION,
  ERRORS,
  NAME_CLASS_HIDING_ELEMENTS,
  REGEX,
  TEXT_BUTTONS,
} from './constants'
import { categoriesElsContainer } from './DOMElements'
import { addNewCategory } from './taskManager'
import type { CategoryArguments, CategoryItemPostType } from './types'
import { rgbToHex, setColorContrast } from './utils'

export const openCategoriesButton = document.querySelector<HTMLButtonElement>(
  '#open-categories-button',
)
export const categoriesDialog =
  document.querySelector<HTMLDialogElement>('#categories-dialog')
export const closeCategoriesButton = document.querySelector<HTMLButtonElement>(
  '#close-categories-button',
)
export const addCategoryButton = document.querySelector<HTMLButtonElement>(
  '#add-category-button',
)
export const categoryNameInput = document.querySelector<HTMLInputElement>(
  '#category-name-input',
)
export const categoryColorInput = document.querySelector<HTMLInputElement>(
  '#category-color-input',
)
export const categoryColorInputText = document.querySelector<HTMLInputElement>(
  '#category-color-text',
)

if (
  !openCategoriesButton ||
  !categoriesDialog ||
  !closeCategoriesButton ||
  !categoriesElsContainer ||
  !addCategoryButton ||
  !categoryNameInput ||
  !categoryColorInput ||
  !categoryColorInputText
) {
  throw new Error(ERRORS.DOM.RootNotFound)
}

openCategoriesButton.addEventListener('click', () => {
  categoriesDialog.show()
})
closeCategoriesButton.addEventListener('click', () => {
  categoriesDialog.close()
})

let activeTextColorHandler: () => void
let activeInputColorHandler: () => void

const setParametersEditContainer = (
  parent: HTMLSpanElement,
  colorParent: string,
) => {
  const nameCategory =
    parent.querySelector<HTMLParagraphElement>('.category-name')
  const nameEditInput = parent.querySelector<HTMLInputElement>(
    '.category-name-input',
  )
  const colorInput = parent.querySelector<HTMLInputElement>(
    '.category-color-input',
  )
  const colorInputText = parent.querySelector<HTMLInputElement>(
    '.category-color-text',
  )
  if (!colorInput || !colorInputText || !nameEditInput || !nameCategory) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  // give functionality for envents listeners
  activeTextColorHandler = () => (colorInputText.value = colorInput.value)
  activeInputColorHandler = () => {
    if (REGEX.hex.test(colorInputText.value)) {
      colorInput.value = colorInputText.value
      return
    }
    colorInputText.value = rgbToHex(colorParent)
  }
  // Set the paramettre of edit container
  colorInput.value = `#${rgbToHex(colorParent)}`
  colorInputText.value = `#${rgbToHex(colorParent)}`
  nameEditInput.value = nameCategory.textContent
  colorInputText.style.color = setColorContrast(colorParent)
  parent.style.color = setColorContrast(colorParent)
  colorInput.addEventListener('input', activeTextColorHandler)
  colorInputText.addEventListener('focusout', activeInputColorHandler)

  return
}

const setParamenterFromEditToParent = (
  parent: HTMLSpanElement,
  button_targeted: HTMLButtonElement,
) => {
  const nameCategory =
    parent.querySelector<HTMLParagraphElement>('.category-name')
  const nameEditInput = parent.querySelector<HTMLInputElement>(
    '.category-name-input',
  )
  const colorInput = parent.querySelector<HTMLInputElement>(
    '.category-color-input',
  )
  const colorInputText = parent.querySelector<HTMLInputElement>(
    '.category-color-text',
  )
  if (!colorInput || !colorInputText || !nameEditInput || !nameCategory) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }

  colorInput.removeEventListener('input', activeTextColorHandler)
  colorInputText.removeEventListener('focusout', activeInputColorHandler)
  parent.classList.remove(NAME_CLASS_HIDING_ELEMENTS)
  nameCategory.textContent = nameEditInput.value
  if (REGEX.hex.test(colorInputText.value)) {
    const newDataCategory: Partial<CategoryItemPostType> = {
      title: nameEditInput.value,
      color: colorInput.value,
    }
    parent.style.backgroundColor = colorInput.value
    // Update variable
    const colorParent = parent.style.backgroundColor
    parent.style.color = setColorContrast(colorParent)
    colorInputText.style.color = setColorContrast(colorParent)
    // target.textContent = TEXT_BUTTONS.editButton
    patchCategory(parent.id, newDataCategory)
  } else if (button_targeted.dataset.action === BUTTON_ACTION.remove) {
    parent.remove()
    deleteCategory(parent.id)
  }
}

categoriesElsContainer.addEventListener('click', (event) => {
  const target = event.target as HTMLButtonElement
  const parent = target.closest<HTMLSpanElement>('.category-element')
  if (!parent) {
    throw new Error(ERRORS.DOM.ContainerNotFound)
  }
  if (target.dataset.action === BUTTON_ACTION.edit) {
    const nameCategory =
      parent.querySelector<HTMLParagraphElement>('.category-name')
    const nameEditInput = parent.querySelector<HTMLInputElement>(
      '.category-name-input',
    )
    const colorInput = parent.querySelector<HTMLInputElement>(
      '.category-color-input',
    )
    const colorInputText = parent.querySelector<HTMLInputElement>(
      '.category-color-text',
    )
    if (!colorInput || !colorInputText || !nameEditInput || !nameCategory) {
      throw new Error(ERRORS.DOM.ContainerNotFound)
    }
    const colorParent = parent.style.backgroundColor

    if (!parent.classList.contains(NAME_CLASS_HIDING_ELEMENTS)) {
      target.textContent = TEXT_BUTTONS.saveButton
      parent.classList.add(NAME_CLASS_HIDING_ELEMENTS)
      setParametersEditContainer(parent, colorParent)
      return
    }
    setParamenterFromEditToParent(parent, target)
    return
  }
})

const categoryArguments: CategoryArguments = {
  categoryNameInput,
  categoryColorInput,
  categoriesElsContainer,
}

addCategoryButton.addEventListener('click', () =>
  addNewCategory(categoryArguments),
)
categoryNameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addNewCategory(categoryArguments)
  }
})
categoryColorInputText.value = categoryColorInput.value
categoryColorInput.addEventListener('input', () => {
  categoryColorInputText.value = categoryColorInput.value
})
categoryColorInputText.addEventListener('blur', () => {
  categoryColorInput.value = categoryColorInputText.value
})
