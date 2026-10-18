export type Admin = {
  id: number
  name?: string | null
  login?: string
  email?: string | null
}

type MeResponse = {
  success: boolean
  data?: { admin?: Admin }
}

type LoginResponse = {
  success: boolean
  data?: {
    admin?: Admin
    expiresAt?: string
  }
}

class AuthService {
  #apiBase() {
    const config = useRuntimeConfig()
    return `${config.public.apiUrl}/api/v1/admin`
  }

  /** Проверка авторизации — GET /me */
  async checkAuth(): Promise<Admin | null> {
    try {
      const res = await $fetch<MeResponse>(`${this.#apiBase()}/me`, {
        credentials: 'include',
      })
      return res?.data?.admin ?? null
    } catch {
      return null
    }
  }

  /** Авторизация — POST /login */
  async login(login: string, password: string): Promise<LoginResponse> {
    return $fetch<LoginResponse>(`${this.#apiBase()}/login`, {
      method: 'POST',
      body: { login, password },
      credentials: 'include',
    })
  }

  /** Регистрация — POST /register */
  async register(
    email: string,
    password: string,
    secretRegisterKey: string,
  ): Promise<void> {
    await $fetch(`${this.#apiBase()}/register`, {
      method: 'POST',
      body: { email, password, secretRegisterKey },
    })
  }

  /** Выход — POST /logout */
  async logout(): Promise<void> {
    await $fetch(`${this.#apiBase()}/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  }
}

export default new AuthService()
