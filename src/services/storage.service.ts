import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  cleanItem(key: string) {
    localStorage.removeItem(key);
  }
  setItem(key: string, value: any): void {
    if (value) {
      const hasItem = this.getItem(key) ? true : false;

      if (hasItem) {
        const items = this.getItem(key) || [];

        items.push(value);

        localStorage.setItem(key, JSON.stringify(items));
      } else {
        localStorage.setItem(key, JSON.stringify([value]));
      }
    }
  }

  getItem(key: string): any {
    return JSON.parse(localStorage.getItem(key) as any);
  }
}
