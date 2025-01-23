import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _snackBar = inject(MatSnackBar);

  showSuccess(message: string) {
    this._snackBar.open(message, 'OK');
  }

  showWarning(message: string) {
    this._snackBar.open(message, 'OK');
  }
}
