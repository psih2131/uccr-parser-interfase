class AiService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/ai`
  }

  /** Обогатить все посты — POST /rab-spec/enrich-all */
  async enrichRabSpecAll() {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/rab-spec/enrich-all`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  /** Статус обогащения — GET /rab-spec/status */
  async getEnrichStatus() {
    return $fetch<{
      success: boolean
      data?: {
        'rab-spec'?: { statusLoad?: string | null }
      }
    }>(`${this.#apiBase()}/rab-spec/status`, {
      credentials: 'include',
    })
  }
}

export default new AiService()
