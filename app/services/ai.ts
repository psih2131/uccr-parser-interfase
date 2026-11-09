class AiService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/ai`
  }

  /** Обогатить N постов — POST /rab-spec/enrich-all/:count */
  async enrichRabSpecCount(count) {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/rab-spec/enrich-all/${count}`, {
      method: 'POST',
      credentials: 'include',
    })
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

  /** Обогатить N постов профпереподготовки — POST /prof-pere/enrich-all/:count */
  async enrichProfPereCount(count) {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/prof-pere/enrich-all/${count}`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  /** Обогатить все посты профпереподготовки — POST /prof-pere/enrich-all */
  async enrichProfPereAll() {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/prof-pere/enrich-all`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  /** Обогатить N постов повышения квалификации — POST /pov-kval/enrich-all/:count */
  async enrichPovKvalCount(count) {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/pov-kval/enrich-all/${count}`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  /** Обогатить все посты повышения квалификации — POST /pov-kval/enrich-all */
  async enrichPovKvalAll() {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/pov-kval/enrich-all`, {
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
        'prof-pere'?: { statusLoad?: string | null }
        'pov-kval'?: { statusLoad?: string | null }
      }
    }>(`${this.#apiBase()}/rab-spec/status`, {
      credentials: 'include',
    })
  }

  /** Статус обогащения профпереподготовки — GET /prof-pere/status */
  async getProfPereEnrichStatus() {
    return $fetch<{
      success: boolean
      data?: {
        'rab-spec'?: { statusLoad?: string | null }
        'prof-pere'?: { statusLoad?: string | null }
        'pov-kval'?: { statusLoad?: string | null }
      }
    }>(`${this.#apiBase()}/prof-pere/status`, {
      credentials: 'include',
    })
  }

  /** Статус обогащения повышения квалификации — GET /pov-kval/status */
  async getPovKvalEnrichStatus() {
    return $fetch<{
      success: boolean
      data?: {
        'rab-spec'?: { statusLoad?: string | null }
        'prof-pere'?: { statusLoad?: string | null }
        'pov-kval'?: { statusLoad?: string | null }
      }
    }>(`${this.#apiBase()}/pov-kval/status`, {
      credentials: 'include',
    })
  }
}

export default new AiService()
