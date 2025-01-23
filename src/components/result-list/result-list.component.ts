import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';

import { filter, Subscription } from 'rxjs';

import { StorageService } from '../../services/storage.service';
import { SEARCH_BY_WEATHER_KEY } from '../../services/weather.service';
import { EventService } from '../../services/event.service';
import { WeatherSearchResponse } from '../../models/weather.models';
import { CHANGE_SEARCH_OPTIONS } from '../../pages/weather/weather';
import { SELECT_WEATHER_ITEM } from './result-list';
import {
  FAVORITE_UPDATE,
  FavoriteService,
} from '../../services/favorite.service';
import { AlertService } from '../../helpers/alert.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  imports: [CommonModule, MatIconModule, ScrollingModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListComponent implements OnInit, OnDestroy {
  @Input()
  showAllResults = false;

  @Input()
  sourceTag = SEARCH_BY_WEATHER_KEY;

  @Input()
  title = 'PANEL_LIST.RECENT_SEARCHES';

  @Input()
  showFavoriteOption = true;

  list: Array<WeatherSearchResponse & { isFavorite?: boolean }> = [];
  searchOptions = {
    showResultInCelcius: true,
  };

  private subscriptions = new Subscription();

  constructor(
    private storageService: StorageService,
    private eventService: EventService,
    private changeDetection: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.watchEvents();
    this.handleInitialSource();
    this.resolveItemsInFavorites();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectItem(item: WeatherSearchResponse) {
    this.eventService.emit(SELECT_WEATHER_ITEM, item);
    this.router.navigate(['/dashboard/weather']);
  }

  toggleFavorite(
    item: WeatherSearchResponse & { isFavorite?: boolean },
    value: boolean
  ) {
    if (value) {
      this.alertService.showWarning(
        `${item.location.name} added successfully to favorites`
      );
      this.favoriteService.add(item);
    } else {
      this.favoriteService.remove(item);
    }
  }

  private resolveItemsInFavorites() {
    const favorites = (this.favoriteService.get() || []).map(
      (item) => `${item.location.name},${item.location.country}`
    );

    const map = new Set(favorites);

    for (const el of this.list) {
      if (map.has(`${el.location.name},${el.location.country}`)) {
        el.isFavorite = true;
      } else {
        el.isFavorite = false;
      }
    }

    this.draw();
  }

  private watchEvents() {
    this.subscriptions.add(
      this.eventService.events$
        .pipe(
          filter((res) => Boolean(res)),
          filter((res) => res.type === SEARCH_BY_WEATHER_KEY)
        )
        .subscribe((event) => {
          const item = event.value as WeatherSearchResponse;
          this.list = this.showAllResults
            ? [item, ...this.list]
            : [item, ...this.list].splice(0, 8);
          this.draw();
        })
    );
    this.subscriptions.add(
      this.eventService.events$
        .pipe(
          filter((res) => Boolean(res)),
          filter((res) => res.type === CHANGE_SEARCH_OPTIONS)
        )
        .subscribe((event) => {
          this.searchOptions = event.value;
          this.draw();
        })
    );
    this.subscriptions.add(
      this.eventService.events$
        .pipe(
          filter((res) => Boolean(res)),
          filter((res) => res.type === FAVORITE_UPDATE)
        )
        .subscribe((event) => {
          this.handleInitialSource();
          this.resolveItemsInFavorites();
          this.draw();
        })
    );
  }

  handleInitialSource() {
    const list =
      (this.storageService.getItem(
        this.sourceTag
      ) as Array<WeatherSearchResponse>) || [];

    this.list = this.showAllResults
      ? list.reverse()
      : list.reverse().splice(0, 8);
    this.draw();
  }

  private draw() {
    this.changeDetection.detectChanges();
  }
}
