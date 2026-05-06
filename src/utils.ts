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

export const isColorLight = (rgb: string): boolean => {
  const match = rgb.match(/\d+/g)
  if (!match || match.length < 3) return false
  const [r, g, b] = match.map(Number)
  const luminance = (0.299 * r + 0.587 * g + 0.144 * b) / 255
  return luminance > 0.5
}

export const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/\d+/g)
  if (!match || match.length < 3) return ''
  return match
    .slice(0, 3)
    .map((color) => Number(color).toString(16).padStart(2, '0'))
    .join('')
}
