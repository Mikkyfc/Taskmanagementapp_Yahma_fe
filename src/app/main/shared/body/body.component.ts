import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

}
