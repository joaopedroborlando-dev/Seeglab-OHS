import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
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
}
