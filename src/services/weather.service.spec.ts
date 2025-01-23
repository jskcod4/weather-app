import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';
import { SEARCH_BY_WEATHER_KEY, WeatherService } from './weather.service';
import { CacheService } from './cache.service';
import { StorageService } from './storage.service';
import { EventService } from './event.service';
import { City } from '../models/city.model';
import { environment } from '../environments/environment';
import { WeatherSearchResponse } from '../models/weather.models';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;

  beforeEach(() => {
    const cacheSpy = jasmine.createSpyObj('CacheService', ['get']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['setItem']);
    const eventSpy = jasmine.createSpyObj('EventService', ['emit']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: CacheService, useValue: cacheSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: EventService, useValue: eventSpy },
      ],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheServiceSpy = TestBed.inject(
      CacheService
    ) as jasmine.SpyObj<CacheService>;
    storageServiceSpy = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    eventServiceSpy = TestBed.inject(
      EventService
    ) as jasmine.SpyObj<EventService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchCities', () => {
    it('should call cacheService.get with the correct URL and return cities', () => {
      const mockCities: City[] = [
        { name: 'London' },
        { name: 'New York' },
      ] as City[];
      const cityName = 'London';
      const url = `http://api.weatherapi.com/v1/search.json?key=${environment.apiKey}&q=${cityName}`;

      // Simula que cacheService.get devuelve un Observable
      cacheServiceSpy.get.and.returnValue(of(mockCities));

      service.searchCities(cityName).subscribe((result) => {
        expect(result).toEqual(mockCities);
      });

      expect(cacheServiceSpy.get).toHaveBeenCalledWith(
        url,
        jasmine.any(Observable)
      );
    });
  });

  describe('getWeather', () => {
    it('should call cacheService.get with the correct URL, store the response, and emit an event', () => {
      const mockWeatherResponse: WeatherSearchResponse = {
        location: { name: 'London' },
        current: { temp_c: 20, condition: { text: 'Sunny' } },
      } as WeatherSearchResponse;
      const cityName = 'London';
      const url = `http://api.weatherapi.com/v1/current.json?key=${environment.apiKey}&q=${cityName}&aqi=no`;

      // Simula que cacheService.get devuelve un Observable
      cacheServiceSpy.get.and.returnValue(of(mockWeatherResponse));

      service.getWeather(cityName).subscribe((result) => {
        expect(result).toEqual(mockWeatherResponse);
      });

      expect(cacheServiceSpy.get).toHaveBeenCalledWith(
        url,
        jasmine.any(Observable)
      );
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        SEARCH_BY_WEATHER_KEY,
        mockWeatherResponse
      );
      expect(eventServiceSpy.emit).toHaveBeenCalledWith(
        SEARCH_BY_WEATHER_KEY,
        mockWeatherResponse
      );
    });
  });
});
