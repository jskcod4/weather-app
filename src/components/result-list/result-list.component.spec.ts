import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultListComponent } from './result-list.component';
import { StorageService } from '../../services/storage.service';
import { EventService } from '../../services/event.service';
import { FavoriteService } from '../../services/favorite.service';
import { AlertService } from '../../helpers/alert.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WeatherSearchResponse } from '../../models/weather.models';

describe('ResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockWeatherItem: WeatherSearchResponse = {
    location: {
      name: 'New York',
      country: 'USA',
      region: '',
      lat: 0,
      lon: 0,
      tz_id: '',
      localtime_epoch: 0,
      localtime: '',
    },
    current: {
      last_updated_epoch: 0,
      last_updated: '',
      temp_c: 25,
      temp_f: 77,
      is_day: 1,
      condition: { text: 'Sunny', icon: '', code: 0 },
      wind_mph: 0,
      wind_kph: 0,
      wind_degree: 0,
      wind_dir: '',
      pressure_mb: 0,
      pressure_in: 0,
      precip_mm: 0,
      precip_in: 0,
      humidity: 0,
      cloud: 0,
      feelslike_c: 0,
      feelslike_f: 0,
      vis_km: 0,
      vis_miles: 0,
      uv: 0,
      gust_mph: 0,
      gust_kph: 0,
      windchill_c: 0,
      windchill_f: 0,
      heatindex_c: 0,
      heatindex_f: 0,
      dewpoint_c: 0,
      dewpoint_f: 0,
    },
  };

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem']);
    mockEventService = jasmine.createSpyObj(
      'EventService',
      ['emit', 'events$'],
      { events$: new Subject() }
    );
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', [
      'get',
      'add',
      'remove',
    ]);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showWarning']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ResultListComponent],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: EventService, useValue: mockEventService },
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
  });

  it('component must be created', () => {
    expect(component).toBeTruthy();
  });

  it('must be initialized with data from storage', () => {
    mockStorageService.getItem.and.returnValue([mockWeatherItem]);
    component.handleInitialSource();
    expect(component.list.length).toBe(1);
    expect(component.list[0].location.name).toBe('New York');
  });

  it('must emit an event when selecting an item', () => {
    component.selectItem(mockWeatherItem);
    expect(mockEventService.emit).toHaveBeenCalledWith(
      'SELECT_WEATHER_ITEM',
      mockWeatherItem
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/weather']);
  });

  it('you must add an item to favorites', () => {
    component.toggleFavorite(mockWeatherItem, true);
    expect(mockAlertService.showWarning).toHaveBeenCalledWith(
      'New York added successfully to favorites'
    );
    expect(mockFavoriteService.add).toHaveBeenCalledWith(mockWeatherItem);
  });

  it('you must remove an item from favorites', () => {
    component.toggleFavorite(mockWeatherItem, false);
    expect(mockFavoriteService.remove).toHaveBeenCalledWith(mockWeatherItem);
  });

  it('you must clear the subscriptions by destroying the component', () => {
    const unsubscribeSpy = spyOn(
      component['subscriptions'],
      'unsubscribe'
    ).and.callThrough();
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
