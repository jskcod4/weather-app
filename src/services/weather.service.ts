import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { WeatherSearchResponse } from '../models/weather.models';
import { Observable, tap } from 'rxjs';
import { City } from '../models/city.model';
import { CacheService } from './cache.service';
import { StorageService } from './storage.service';
import { EventService } from './event.service';

export const SEARCH_BY_WEATHER_KEY = 'SEARCH_BY_WEATHER_KEY';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private storageService: StorageService,
    private eventService: EventService
  ) {}

  searchCities(city: string): Observable<City[]> {
    const url = `http://api.weatherapi.com/v1/search.json?key=${environment.apiKey}&q=${city}`;
    const observable = this.http.get<City[]>(url);
    return this.cacheService.get(url, observable);
  }

  getWeather(city: string): Observable<WeatherSearchResponse> {
    const url = `http://api.weatherapi.com/v1/current.json?key=${environment.apiKey}&q=${city}&aqi=no`;
    const observable = this.http.get<WeatherSearchResponse>(url);
    return this.cacheService.get(url, observable).pipe(
      tap((res) => {
        this.storageService.setItem(SEARCH_BY_WEATHER_KEY, res);
        this.eventService.emit(SEARCH_BY_WEATHER_KEY, res);
      })
    );
  }
}
