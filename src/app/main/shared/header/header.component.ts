import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  elementRef = inject(ElementRef);
  isMenuOpen = false;
  isDropdownOpen = false;
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isDropdownOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(status?: boolean) {
    this.isDropdownOpen = status ?? !this.isDropdownOpen;
  }
}
