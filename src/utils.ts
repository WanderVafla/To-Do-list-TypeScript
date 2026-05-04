export const getCurrentDate = (): string => {
  const date = new Date()
  const dateYear = date.getFullYear()
  const dateMonth = String(date.getMonth() + 1).padStart(2, '0')
  const dateDay = String(date.getDate()).padStart(2, '0')
  return `${dateYear}-${dateMonth}-${dateDay}`
}

export const getDaysDueDiff = (due: string): number | null => {
  if (due) {
    const targetDate = new Date(due)
    const currentDate = new Date(getCurrentDate())
    const diffTime = targetDate.getTime() - currentDate.getTime()
    // Calculate the difference in days
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  return null
}

export const checkColorDark = (rgb: string): boolean => {
  const regex = /\d{1,3}.\s\d{1,3}.\s\d{1,3}/g
  const parsetColorRgb = String(regex.exec(rgb)).split(', ')
  const [r, g, b] = parsetColorRgb.map(Number)
  const luminance = (0.299 * r + 0.587 * g + 0.144 * b) / 255
  return luminance > 0.5
}

export const rgbToHex = (rgb: string): string => {
  const regex = /\d{1,3}.\s\d{1,3}.\s\d{1,3}/g
  const parsetColorRgb = String(regex.exec(rgb))
    .split(', ')
    .map((color) => Number(color).toString(16).padStart(2, '0'))
    .join('')
  return parsetColorRgb
}
