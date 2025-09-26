import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollAnimationDirective } from '../../../drivatives/scroll-animation.directive';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, ScrollAnimationDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
