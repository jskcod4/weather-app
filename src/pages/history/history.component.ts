import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResultListComponent } from '../../components/result-list/result-list.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  imports: [CommonModule, ResultListComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {}
