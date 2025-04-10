import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, takeUntil } from 'rxjs';
import { CompanyProfileService } from 'src/app/feature/company-profile/company-profile.service';
import { DataService } from '../../services';
import { ACTION_TYPE } from '../../configs/app.constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sync-btn',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, NgIf],
  templateUrl: './sync-btn.component.html',
  styleUrls: ['./sync-btn.component.scss'],
})
export class SyncBtnComponent {
  @Input() showNavigateBtn = true;
  nodeId: string;
  private myService = inject(CompanyProfileService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  constructor() {
    this.nodeId = this.route.snapshot.params['id'];
  }

  /**
   * The `syncWithNavigate` function in TypeScript synchronizes with navigation and displays
   * corresponding snack bar messages based on success or failure.
   */
  syncWithNavigate(): void {
    const params = { node: this.nodeId };
    this.myService
      .syncWithNavigate(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dataService.customSnackBar(
            'Syncing started, it will take a few minutes',
            ACTION_TYPE.SUCCESS
          );
        },
        error: (error: any) => {
          const message =
            error?.error?.detail?.detail ||
            error?.detail?.detail ||
            'Something went wrong!';
          this.dataService.customSnackBar(message, ACTION_TYPE.FAILED);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
