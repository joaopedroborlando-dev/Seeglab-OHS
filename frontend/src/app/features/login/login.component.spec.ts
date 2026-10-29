import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNgxMask } from 'ngx-mask';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'signup']);
    authService.login.and.resolveTo();
    authService.signup.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideNgxMask(),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call login when the email is invalid', async () => {
    component.emailControl.setValue('user@domain');
    component.passwordControl.setValue('secret');

    await component.handleLogin();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.emailControl.touched).toBeTrue();
  });

  it('should call login with the trimmed email when the form is valid', async () => {
    component.emailControl.setValue(' user@domain.com ');
    component.passwordControl.setValue('secret');

    await component.handleLogin();

    expect(authService.login).toHaveBeenCalledWith('user@domain.com', 'secret');
  });

  it('should not call signup when phone or document are invalid', async () => {
    component.emailControl.setValue('user@domain.com');
    component.passwordControl.setValue('secret');
    component.phoneControl.setValue('(11) 1234');
    component.documentControl.setValue('12345678900');

    await component.handleSignup();

    expect(authService.signup).not.toHaveBeenCalled();
    expect(component.phoneControl.hasError('phone')).toBeTrue();
    expect(component.documentControl.hasError('document')).toBeTrue();
  });

  it('should call signup when every field is valid', async () => {
    component.emailControl.setValue('user@domain.com');
    component.passwordControl.setValue('secret');
    component.phoneControl.setValue('(11) 98765-4321');
    component.documentControl.setValue('52998224725');

    await component.handleSignup();

    expect(authService.signup).toHaveBeenCalledWith('user@domain.com', 'secret', '(11) 98765-4321', '52998224725');
  });
});
