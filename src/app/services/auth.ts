import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '1234') {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.tokenKey, 'fake-jwt-token');
      }
      return true;
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey) !== null;
    }
    return false;
  }
}