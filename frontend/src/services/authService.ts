import axios from "axios"
import Cookies from "js-cookie"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    full_name: string
  }
}

interface RegisterResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    full_name: string
  }
}

class AuthService {
  private tokenKey = "auth_token"
  private userKey = "user_data"

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })

    const data = response.data
    this.setToken(data.access_token)
    this.setUser(data.user)

    return data
  }

  async register(email: string, password: string, fullName: string): Promise<RegisterResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      full_name: fullName,
    })

    const data = response.data
    this.setToken(data.access_token)
    this.setUser(data.user)

    return data
  }

  logout(): void {
    Cookies.remove(this.tokenKey)
    Cookies.remove(this.userKey)
  }

  getToken(): string | null {
    return Cookies.get(this.tokenKey) || null
  }

  setToken(token: string): void {
    Cookies.set(this.tokenKey, token, { expires: 7 }) // 7 days
  }

  getCurrentUser() {
    const userData = Cookies.get(this.userKey)
    return userData ? JSON.parse(userData) : null
  }

  setUser(user: any): void {
    Cookies.set(this.userKey, JSON.stringify(user), { expires: 7 })
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
