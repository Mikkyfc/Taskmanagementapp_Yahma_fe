import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationServicesService {
  constructor(private _snackBar: MatSnackBar) {}

  ShowMessage(message: string, isError: boolean, action: string = 'Close', duration: number = 3000) {
    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: !isError ? 'snackbar-success' : 'snackbar-error',
    });
  }
}
