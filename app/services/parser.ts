type RabSpecListResponse = {
  success: boolean
  data?: {
    posts?: Array<{
      id: number
      url: string
      title: string | null
      parser_load: boolean
      ai_load: boolean | null
      parser_logs: string | null
      created_at: string
      updated_at: string
    }>
  }
}

class ParserService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin/parser`
  }

  rabSpecListUrl() {
    return `${this.#apiBase()}/rab-spec`
  }

  rabSpecByIdUrl(id: string | number) {
    return `${this.#apiBase()}/rab-spec/${id}`
  }

  async getRabSpecList() {
    return $fetch<RabSpecListResponse>(this.rabSpecListUrl(), {
      credentials: 'include',
    })
  }

  async getRabSpecById(id: string | number) {
    return $fetch<{
      success: boolean
      data?: {
        post?: {
          id: number
          url: string
          title: string | null
          parser_load: boolean
          ai_load: boolean | null
          post_data: Record<string, unknown> | null
          ai_data: Record<string, unknown> | null
          parser_logs: string | null
          created_at: string
          updated_at: string
        }
      }
    }>(this.rabSpecByIdUrl(id), {
      credentials: 'include',
    })
  }

  /** Удалить все посты — DELETE /rab-spec */
  async deleteRabSpecAll() {
    return $fetch<{
      success: boolean
      data?: { deleted?: number }
    }>(this.rabSpecListUrl(), {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  /** Запуск парсера — POST /start/:name */
  async startParser(name: string) {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/start/${name}`, {
      method: 'POST',
      credentials: 'include',
    })
  }

  /** Перепарсить один URL — POST /start-one/:name */
  async startOneParser(name: string, url: string) {
    return $fetch<{
      success: boolean
      data?: { statusLoad?: string | null }
    }>(`${this.#apiBase()}/start-one/${name}`, {
      method: 'POST',
      credentials: 'include',
      body: { url },
    })
  }

  /** Статус парсеров — GET /status */
  async getParserStatus() {
    return $fetch<{
      success: boolean
      data?: {
        'rab-spec'?: { statusLoad?: string | null }
      }
    }>(`${this.#apiBase()}/status`, {
      credentials: 'include',
    })
  }
}

export default new ParserService()
