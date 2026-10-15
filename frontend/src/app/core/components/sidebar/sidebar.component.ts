import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    isSidebarOpen = false;
    businessMenuOpen = false;
    pgrMenuOpen = false;
    epiMenuOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleBusinessMenu() {
        this.businessMenuOpen = !this.businessMenuOpen;
    }

    togglePgrMenu() {
        this.pgrMenuOpen = !this.pgrMenuOpen;
    }

    toggleEpiMenu() {
        this.epiMenuOpen = !this.epiMenuOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
