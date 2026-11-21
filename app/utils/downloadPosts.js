export function isEnrichedPost(post) {
  if (post?.ai_load !== true) return false

  const data = post.ai_data
  if (data == null || data === '') return false
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) return false

  return true
}

function hasSourceData(post) {
  const data = post?.post_data
  if (data == null || data === '') return false
  if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) return false
  return true
}

export function postsPendingEnrich(posts, limit = null) {
  const pending = (posts ?? [])
    .filter((post) => hasSourceData(post) && !isEnrichedPost(post))
    .sort((a, b) => Number(a.id) - Number(b.id))

  if (limit == null) return pending
  return pending.slice(0, limit)
}

export async function enrichPendingPosts({ posts, limit = null, enrich }) {
  const pending = postsPendingEnrich(posts, limit)

  for (const post of pending) {
    try {
      await enrich(post.id, post.post_data)
    } catch (error) {
      console.error(`[ai] пост ${post.id}:`, error)
    }
  }

  return pending.length
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
