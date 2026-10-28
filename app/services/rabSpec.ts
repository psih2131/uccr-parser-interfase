class RabSpecService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/parser`
  }

  listUrl() {
    return `${this.#apiBase()}/rab-spec`
  }

  exportUrl() {
    return `${this.#apiBase()}/rab-spec/export`
  }

  /** Удалить все посты — DELETE /rab-spec */
  async deleteAll() {
    const res = await $fetch<{
      success: boolean
      data?: { deleted?: number }
    }>(this.listUrl(), {
      method: 'DELETE',
      credentials: 'include',
    })

    console.log('посты рабочих специальностей удалены:', res?.data?.deleted ?? 0)
    return res
  }

  /** Все посты со всеми данными — GET /rab-spec/export */
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

export default new RabSpecService()
