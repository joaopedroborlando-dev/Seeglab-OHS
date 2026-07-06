import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IAuth } from '../models/interfaces/IAuth';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  cookieService: CookieService = inject(CookieService);
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);

  private authState = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.authState.asObservable();
  private autoLogoutTimer: any;

  constructor() { }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  private setCookies(token: string, email: string, organization: string): void {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expires = new Date(decoded.exp * 1000);

    this.cookieService.set('token', token, { expires, path: '/', sameSite: 'Lax' });
    this.cookieService.set('email', email, { expires, path: '/', sameSite: 'Lax' });
    this.cookieService.set('organization', organization, { expires, path: '/', sameSite: 'Lax' });

    this.authState.next(true);
    const expiresIn = expires.getTime() - new Date().getTime();
    this.autoLogout(expiresIn);
  }

  private autoLogout(expirationDuration: number) {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, expirationDuration);
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.http.post<any>(
      `${environment.base_auth_url}auth/login`,
      { email, password }
    ));
    await this.registerOrganization(response, email);
  }

  logout(): void {
    console.log('chamou logout');
    this.cookieService.delete('token', '/');
    this.cookieService.delete('email', '/');
    this.cookieService.delete('organization', '/');
    this.authState.next(false);
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  async signup(email: string, password: string, phone: string, document: string): Promise<void> {
    const response = await firstValueFrom(this.http.post<any>(
      `${environment.base_auth_url}auth/signup`,
      { email, password, phone, document }
    ));
    await this.registerOrganization(response, email);
  }

  getToken(): string | null {
    return this.cookieService.get('token');
  }

  getAuth(): Observable<IAuth | undefined> {
    return this.cookieService.get('token') ? of({
      token: this.cookieService.get('token'),
      email: this.cookieService.get('email'),
      organization: this.cookieService.get('organization')
    }) : of(undefined);
  }

  async registerOrganization(res: any, email: string) {
    const { userId, organization, token } = res;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log('chamou registerOtganization');
    const response: any = await firstValueFrom(this.http.post(
      `${environment.base_url}organization/register`,
      { userId, organizationId: organization, name: email },
      { headers, observe: 'response' }
    ));
    if (response.status !== 201) {
      throw new Error('Organization registration failed');
    }
    this.setCookies(token, email, organization);
  }

  private hasValidToken(): boolean {
    const token = this.cookieService.get('token');
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    const expirationDate = decoded.exp * 1000;
    const isStillValid = expirationDate > new Date().getTime();

    if (isStillValid) {
      // If valid on app reload, restart the auto logout timer!
      const remainingTime = expirationDate - new Date().getTime();
      this.autoLogout(remainingTime);
      return true;
    } else {
      // Clean up stale cookies immediately if expired
      this.cookieService.delete('token', '/');
      this.cookieService.delete('email', '/');
      this.cookieService.delete('organization', '/');
      return false;
    }
  }
}
