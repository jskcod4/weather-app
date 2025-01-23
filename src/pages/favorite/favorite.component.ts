import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResultListComponent } from '../../components/result-list/result-list.component';
import { FAVORITE_STORAGE_KEY } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  imports: [CommonModule, ResultListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteComponent {
  FAVORITE_STORAGE_KEY = FAVORITE_STORAGE_KEY;
}
