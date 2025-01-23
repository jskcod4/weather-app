import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  debounce,
  distinctUntilChanged,
  filter,
  finalize,
  fromEvent,
  map,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  SEARCH_BY_WEATHER_KEY,
  WeatherService,
} from '../../services/weather.service';
import { AlertService } from '../../helpers/alert.service';
import { City } from '../../models/city.model';
import { WeatherSearchResponse } from '../../models/weather.models';
import { ResultListComponent } from '../../components/result-list/result-list.component';
import { EventService } from '../../services/event.service';
import { CHANGE_SEARCH_OPTIONS } from './weather';
import { SELECT_WEATHER_ITEM } from '../../components/result-list/result-list';
import { StorageService } from '../../services/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ResultListComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchElement')
  searchElement!: ElementRef<HTMLInputElement>;

  keywordSearchCities!: string;
  resultSearchCities: City[] = [];
  showSearchResults = false;
  weatherSearchResponse!: WeatherSearchResponse;

  toggleMobileMenu = false;
  searchOptions = {
    showResultInCelcius: true,
    defaultLanguage: 'en',
  };

  isLoadingSearch = false;
  isLoadingResult = false;

  private subscriptions = new Subscription();

  constructor(
    private weatherService: WeatherService,
    private alertService: AlertService,
    private changeDetection: ChangeDetectorRef,
    private eventService: EventService,
    private storageService: StorageService,
    private activeRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.watchQueryParams();
    this.watchEvents();
    this.selectLastResult();
  }

  ngAfterViewInit(): void {
    this.watchInputEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectCity(city: City) {
    this.showSearchResults = false;

    this.fetchWeatherByCity(`${city.name}, ${city.country}`);
  }

  changeTemperatureUnit(type: 'F' | 'C') {
    this.searchOptions.showResultInCelcius = type === 'C';
    this.changeSearchOptions();
    this.draw();
  }

  changeLanguage(lang: 'ES' | 'EN') {
    this.searchOptions.defaultLanguage = lang.toLowerCase();
    this.translateService.use(this.searchOptions.defaultLanguage);
    this.draw();
  }

  private watchQueryParams() {
    this.subscriptions.add(
      this.activeRoute.queryParamMap.subscribe((res) => {
        const name = res.get('name');
        const country = res.get('country');

        if (name && country) {
          this.showSearchResults = false;

          this.fetchWeatherByCity(`${name}, ${country}`);
        }
      })
    );
  }

  private selectLastResult() {
    const params = this.activeRoute.snapshot.queryParamMap;

    const hasParams = params.get('name') && params.get('country');
    if (!hasParams && this.storageService.getItem(SEARCH_BY_WEATHER_KEY)) {
      const values = this.storageService.getItem(
        SEARCH_BY_WEATHER_KEY
      ) as WeatherSearchResponse[];

      if (values && values.length) {
        const [first] = values;
        this.weatherSearchResponse = first;
        this.draw();
      }
    }
  }

  private watchEvents() {
    this.subscriptions.add(
      this.eventService.events$
        .pipe(
          filter((res) => Boolean(res)),
          filter((res) => res.type === SELECT_WEATHER_ITEM)
        )
        .subscribe((event) => {
          const value = event.value as WeatherSearchResponse;
          const city = value.location;

          this.showSearchResults = false;
          this.fetchWeatherByCity(`${city.name}, ${city.country}`);

          this.draw();
        })
    );
  }
  private changeSearchOptions() {
    this.eventService.emit(CHANGE_SEARCH_OPTIONS, this.searchOptions);
  }

  private watchInputEvents() {
    const inputEvent$ = fromEvent(
      this.searchElement.nativeElement,
      'input'
    ).pipe(map((evt) => (evt.target as HTMLTextAreaElement).value));

    this.subscriptions.add(
      inputEvent$
        .pipe(
          map((value) => value.trim()),
          debounce(() => timer(450)),
          distinctUntilChanged()
        )
        .subscribe((res) => this.fetchSearchCities(res))
    );
  }

  fetchSearchCities(keyword: string) {
    this.keywordSearchCities = keyword;
    this.isLoadingSearch = true;
    this.draw();

    this.weatherService
      .searchCities(keyword)
      .pipe(
        catchError((error) => this.handleFetchError(error)),
        finalize(() => {
          this.isLoadingSearch = false;
          this.draw();
        })
      )
      .subscribe((cities) => {
        this.resultSearchCities = cities;
        this.handleSearchResultState();
        this.draw();
      });
  }

  private handleSearchResultState() {
    if (this.keywordSearchCities && this.keywordSearchCities.trim() !== '') {
      this.showSearchResults = true;
    } else {
      this.showSearchResults = false;
    }
  }

  fetchWeatherByCity(city: string) {
    this.isLoadingResult = true;
    this.draw();

    this.weatherService
      .getWeather(city)
      .pipe(
        catchError((error) => this.handleFetchError(error)),
        finalize(() => {
          this.isLoadingResult = false;
          this.draw();
        })
      )
      .subscribe((weather) => {
        this.weatherSearchResponse = weather;
        this.draw();
      });
  }

  handleFetchError(response: HttpErrorResponse) {
    if (response.status === 0) {
      this.alertService.showWarning('Please check your internet connection.');
    } else if (response.status === 400) {
      if (response?.error?.error?.code === 1006) {
        this.alertService.showWarning('Please enter a valid city name.');
      }
    }

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  private draw() {
    this.changeDetection.detectChanges();
  }
}
