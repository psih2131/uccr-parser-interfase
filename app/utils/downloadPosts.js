export function isEnrichedPost(post) {
  if (post?.ai_load !== true) return false

  const data = post.ai_data
  if (data == null || data === '') return false
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) return false

  return true
}

export function downloadJson(filename, data) {
  const text = JSON.stringify(data, null, 2)
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
