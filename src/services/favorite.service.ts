import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { WeatherSearchResponse } from '../models/weather.models';
import { EventService } from './event.service';

export const FAVORITE_STORAGE_KEY = 'FAVORITE_STORAGE_KEY';
export const FAVORITE_UPDATE = 'FAVORITE_UPDATE';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(
    private storageService: StorageService,
    private eventService: EventService
  ) {}

  add(value: WeatherSearchResponse) {
    this.storageService.setItem(FAVORITE_STORAGE_KEY, value);
    this.eventService.emit(FAVORITE_UPDATE, value);
  }

  remove(value: WeatherSearchResponse) {
    const values = this.get().filter(
      (item) =>
        item.location.name !== value.location.name &&
        item.location.country !== value.location.country
    );

    this.storageService.cleanItem(FAVORITE_STORAGE_KEY);

    for (const item of values) {
      if (item) {
        this.storageService.setItem(FAVORITE_STORAGE_KEY, item);
      }
    }
    this.eventService.emit(FAVORITE_UPDATE, value);
  }

  get(): WeatherSearchResponse[] {
    return this.storageService.getItem(
      FAVORITE_STORAGE_KEY
    ) as WeatherSearchResponse[];
  }
}
