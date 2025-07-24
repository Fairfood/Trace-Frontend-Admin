import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { CompanyProfileService } from 'src/app/feature/company-profile/company-profile.service';
import { DataService } from '../../services';
import { ACTION_TYPE } from '../../configs/app.constants';
import { ActivatedRoute } from '@angular/router';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sync-btn',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, NgIf, NgClass, MatTooltipModule],
  templateUrl: './sync-btn.component.html',
  styleUrls: ['./sync-btn.component.scss'],
})
export class SyncBtnComponent {
  @ViewChild('tooltip') tooltip: MatTooltip;
  @Input() showNavigateBtn = true;
  nodeId: string;
  syncing = false;
  tooltipContent =
    'Syncing with Navigate has started , it might take a few minutes to finish.';

  private myService = inject(CompanyProfileService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  constructor() {
    this.nodeId = this.route.snapshot.params['id'];
  }

  /**
   * The `syncWithNavigate` function in TypeScript synchronizes with navigation and displays
   * corresponding snack bar messages based on success or failure.
   */
  syncWithNavigate(): void {
    this.syncing = true;
    this.cdr.detectChanges();
    this.showTooltip();
    const params = { node: this.nodeId };
    this.myService
      .syncWithNavigate(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // this.dataService.customSnackBar(
          //   'Syncing started, it will take a few minutes',
          //   ACTION_TYPE.SUCCESS
          // );
          setTimeout(() => {
            this.syncing = false;
          }, 3000);
        },
        error: (error: any) => {
          const message =
            error?.error?.detail?.detail ||
            error?.detail?.detail ||
            'Something went wrong!';
          this.dataService.customSnackBar(message, ACTION_TYPE.FAILED);
          setTimeout(() => {
            this.syncing = false;
          }, 3000);
        },
      });
  }

  /**
   * The function `showTooltip` displays a tooltip if a condition is met and hides it after 3 seconds.
   */
  showTooltip() {
    if (this.syncing) {
      this.tooltip.show();
      setTimeout(() => {
        this.tooltip.hide();
      }, 3000); // Hide tooltip after 3 seconds
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
