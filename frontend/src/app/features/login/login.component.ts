import { Component, inject, OnInit, } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastService } from '../../core/services/toast.service';
import { documentValidator, emailValidator, phoneValidator } from '../../shared/utils/formValidators';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  emailControl = new FormControl('', [Validators.required, Validators.maxLength(254), emailValidator()]);
  passwordControl = new FormControl('', [Validators.required]);
  phoneControl = new FormControl('', [Validators.required, phoneValidator()]);
  documentControl = new FormControl('', [Validators.required, documentValidator()]);

  authService = inject(AuthService)
  router: Router = inject(Router);
  translateService: TranslateService = inject(TranslateService);
  toastService: ToastService = inject(ToastService);

  error: boolean = false;
  signupSelected: boolean = false;
  documentInputPlaceholder: string = 'DOCUMENT_ID';

  constructor() { }

  ngOnInit(): void {
    this.getDocumentIDPlaceholder();
  }

  async handleLogin() {
    if (this.isFormInvalid([this.emailControl, this.passwordControl])) return;

    this.authService.login(
      this.emailControl.value?.trim() ?? "",
      this.passwordControl.value ?? ""
    ).then(() => {
      this.error = false;
      this.router.navigateByUrl('home');
      this.toastService.success('SUCCESSFULLY_LOGGED_IN');
    }).catch((error) => {
      this.error = true;
      console.error('Email/Password Sign-In error:', error?.message);
    });
  }

  private isFormInvalid(controls: FormControl[]): boolean {
    controls.forEach(control => control.markAsTouched());
    return controls.some(control => control.invalid);
  }

  setSignup() {
    this.signupSelected = true;
  }

  async handleSignup() {
    if (this.isFormInvalid([this.emailControl, this.passwordControl, this.phoneControl, this.documentControl])) return;

    this.authService.signup(
      this.emailControl.value?.trim() ?? "",
      this.passwordControl.value ?? "",
      this.phoneControl.value ?? "",
      this.documentControl.value ?? "",
    ).then(() => {
      this.error = false;
      this.signupSelected = false;
      this.router.navigateByUrl('home');
      this.toastService.success('SUCCESSFULLY_SIGNUP');
    }).catch((error) => {
      this.error = true;
      console.error('Email/Password Sign-Up error:', error?.message);
    });
  }

  getDocumentIDPlaceholder() {
    const current = this.translateService.currentLang;
    switch (current) {
      case 'pt-BR':
        this.documentInputPlaceholder = 'CPF_CNPJ';
        break;
      default:
        this.documentInputPlaceholder = 'DOCUMENT_ID';
    }
  }

  onBack() {
    this.signupSelected = false;
  }
}
