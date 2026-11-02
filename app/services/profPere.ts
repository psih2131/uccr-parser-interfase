class ProfPereService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/parser`
  }

  listUrl() {
    return `${this.#apiBase()}/prof-pere`
  }

  exportUrl() {
    return `${this.#apiBase()}/prof-pere/export`
  }

  /** Удалить все посты — DELETE /prof-pere */
  async deleteAll() {
    const res = await $fetch<{
      success: boolean
      data?: { deleted?: number }
    }>(this.listUrl(), {
      method: 'DELETE',
      credentials: 'include',
    })

    console.log('посты профпереподготовки удалены:', res?.data?.deleted ?? 0)
    return res
  }

  /** Все посты со всеми данными — GET /prof-pere/export */
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

export default new ProfPereService()
