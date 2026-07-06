import { Component, inject, OnInit, } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';

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

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  phoneControl = new FormControl('', [Validators.required, Validators.minLength(10)]);
  documentControl = new FormControl('', [Validators.required, Validators.minLength(11)]);

  authService = inject(AuthService)
  router: Router = inject(Router);
  translateService: TranslateService = inject(TranslateService);

  error: boolean = false;
  signupSelected: boolean = false;
  documentInputPlaceholder: string = 'DOCUMENT_ID';

  constructor() { }

  ngOnInit(): void {
    this.getDocumentIDPlaceholder();
  }

  async handleLogin() {
    this.authService.login(
      this.emailControl.value ?? "",
      this.passwordControl.value ?? ""
    ).then(() => {
      this.error = false;
      this.router.navigateByUrl('home');
    }).catch((error) => {
      this.error = true;
      console.error('Email/Password Sign-In error:', error?.message);
    });
  }

  setSignup() {
    this.signupSelected = true;
  }

  async handleSignup() {
    this.authService.signup(
      this.emailControl.value ?? "",
      this.passwordControl.value ?? "",
      this.phoneControl.value ?? "",
      this.documentControl.value ?? "",
    ).then(() => {
      this.error = false;
      this.signupSelected = false;
      this.router.navigateByUrl('home');
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
}
