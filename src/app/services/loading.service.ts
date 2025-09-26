import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  busyRequestCount = 0;
  constructor(private _spinerService : NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    this._spinerService.show(undefined,{
      type:'ball-scale-multiple',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      size: 'default'
    })
  }

  
idle(){
  this.busyRequestCount--;
  if (this.busyRequestCount <= 0) {
    this.busyRequestCount = 0;
    this._spinerService.hide();
  }
}

}
