import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'weather',
        loadComponent: () =>
          import('../pages/weather/weather.component').then(
            (m) => m.WeatherComponent
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('../pages/history/history.component').then(
            (m) => m.HistoryComponent
          ),
      },
      {
        path: 'favorite',
        loadComponent: () =>
          import('../pages/favorite/favorite.component').then(
            (m) => m.FavoriteComponent
          ),
      },
    ],
  },
];
