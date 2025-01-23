import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../../services/weather.service';
import { EventService } from '../../services/event.service';
import { StorageService } from '../../services/storage.service';
import { AlertService } from '../../helpers/alert.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WeatherSearchResponse } from '../../models/weather.models';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  let mockWeatherService: jasmine.SpyObj<WeatherService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockWeatherResponse: WeatherSearchResponse = {
    location: {
      name: 'Test City',
      region: 'Test Region',
      country: 'Test Country',
      lat: 0,
      lon: 0,
      tz_id: 'UTC',
      localtime_epoch: 1633024800,
      localtime: '2025-01-01 12:00',
    },
    current: {
      last_updated_epoch: 1633024800,
      last_updated: '2025-01-01 12:00',
      temp_c: 25,
      temp_f: 77,
      is_day: 1,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000,
      },
      wind_mph: 5,
      wind_kph: 8,
      wind_degree: 90,
      wind_dir: 'E',
      pressure_mb: 1013,
      pressure_in: 29.91,
      precip_mm: 0,
      precip_in: 0,
      humidity: 50,
      cloud: 10,
      feelslike_c: 26,
      feelslike_f: 78.8,
      windchill_c: 25,
      windchill_f: 77,
      heatindex_c: 26,
      heatindex_f: 78.8,
      dewpoint_c: 14,
      dewpoint_f: 57.2,
      vis_km: 10,
      vis_miles: 6,
      uv: 5,
      gust_mph: 10,
      gust_kph: 16,
    },
  };

  beforeEach(async () => {
    mockWeatherService = jasmine.createSpyObj('WeatherService', [
      'searchCities',
      'getWeather',
    ]);
    mockEventService = jasmine.createSpyObj(
      'EventService',
      ['emit', 'events$'],
      {
        events$: of(),
      }
    );
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showWarning']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot'], {
      queryParamMap: of({
        get: (key: string) => {
          if (key === 'name') return 'Test City';
          if (key === 'country') return 'Test Country';
          return null;
        },
      }),
      snapshot: {
        queryParamMap: {
          get: (key: string) => {
            if (key === 'name') return 'Test City';
            if (key === 'country') return 'Test Country';
            return null;
          },
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: EventService, useValue: mockEventService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch weather data when a city is selected', () => {
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherResponse));

    component.selectCity({
      name: 'Test City',
      country: 'Test Country',
      id: 0,
      region: '',
      lat: 0,
      lon: 0,
      url: '',
    });
    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(
      'Test City, Test Country'
    );
    expect(component.weatherSearchResponse).toEqual(mockWeatherResponse);
    expect(component.showSearchResults).toBeFalse();
  });

  it('should fetch cities on keyword input', () => {
    mockWeatherService.searchCities.and.returnValue(
      of([
        {
          name: 'Test City',
          country: 'Test Country',
          id: 0,
          region: '',
          lat: 0,
          lon: 0,
          url: '',
        },
      ])
    );

    component['fetchSearchCities']('Test');
    expect(mockWeatherService.searchCities).toHaveBeenCalledWith('Test');
    expect(component.resultSearchCities.length).toBe(1);
  });

  it('should change temperature unit and emit an event', () => {
    component.changeTemperatureUnit('F');
    expect(component.searchOptions.showResultInCelcius).toBeFalse();
    expect(mockEventService.emit).toHaveBeenCalledWith(
      'CHANGE_SEARCH_OPTIONS',
      component.searchOptions
    );
  });

  it('should watch query params and fetch weather data', () => {
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherResponse));

    component['watchQueryParams']();
    expect(mockWeatherService.getWeather).toHaveBeenCalledWith(
      'Test City, Test Country'
    );
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');

    component.ngOnDestroy();
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
