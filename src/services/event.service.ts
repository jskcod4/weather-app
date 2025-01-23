import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private source = new BehaviorSubject<{ type: string; value: any }>({
    type: '',
    value: null,
  });

  public events$ = this.source.asObservable();

  public emit(type: string, value: any) {
    this.source.next({
      type,
      value,
    });
  }
}
