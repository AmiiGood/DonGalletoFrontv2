import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuInterface, MenuItems } from '../../interfaces/menu/menu-items';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuItems: MenuInterface[] = MenuItems;
  isExpanded = false;

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    // Forzar actualización del layout
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}
