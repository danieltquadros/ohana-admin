import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<LoginResponse['user'] | null>(null);

  isAuthenticated = computed(() => !!this.tokenSignal());
  user = computed(() => this.userSignal());
  token = computed(() => this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  handleLoginSuccess(response: LoginResponse) {
    localStorage.setItem('token', response.accessToken);
    this.tokenSignal.set(response.accessToken);
    this.userSignal.set(response.user);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
