import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastContainerComponent } from './core/components/toast-container/toast-container.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TranslateModule, ToastContainerComponent, AsyncPipe],
  template: `
    @if (authService.isAuthenticated$ | async) {
      <app-toast-container></app-toast-container>
      <div class="main-layout">
        <app-sidebar></app-sidebar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    } @else {
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    }
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService)
  translateService: TranslateService = inject(TranslateService);

  constructor() {
    this.translateService.setDefaultLang('pt-BR');
    this.translateService.use('pt-BR');
  }

  switchLanguage(language: string) {
    this.translateService.use(language);
  }

}
