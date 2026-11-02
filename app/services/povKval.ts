class PovKvalService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/parser`
  }

  listUrl() {
    return `${this.#apiBase()}/pov-kval`
  }

  exportUrl() {
    return `${this.#apiBase()}/pov-kval/export`
  }

  /** Удалить все посты — DELETE /pov-kval */
  async deleteAll() {
    const res = await $fetch<{
      success: boolean
      data?: { deleted?: number }
    }>(this.listUrl(), {
      method: 'DELETE',
      credentials: 'include',
    })

    console.log('посты повышения квалификации удалены:', res?.data?.deleted ?? 0)
    return res
  }

  /** Все посты со всеми данными — GET /pov-kval/export */
  async getExport() {
    return $fetch<{
      success: boolean
      data?: {
        posts?: Array<Record<string, unknown>>
      }
    }>(this.exportUrl(), {
      credentials: 'include',
    })
  }
}

export default new PovKvalService()
