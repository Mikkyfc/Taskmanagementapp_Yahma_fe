import { Component, input, output } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-pagenation',
  imports: [NgxPaginationModule],
  templateUrl: './pagenation.component.html',
  styleUrl: './pagenation.component.scss'
})
export class PagenationComponent {
currentPage = output<number>() ;
  itemsPerPage = 10;
  totalItems = input.required<number>() ;

  pageChanged(event: number) {
    
    this.currentPage.emit(event);
  }
}
