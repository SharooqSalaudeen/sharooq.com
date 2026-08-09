export const resolveUrlPath = (base: string, path = '') => new URL(path, base).toString()

export const parseAbsoluteUrl = (value: string) => {
  try {
    return new URL(value)
  } catch {
    return null
  }
}
