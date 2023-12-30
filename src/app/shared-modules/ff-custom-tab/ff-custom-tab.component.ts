/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TabItem } from 'src/app/core/utils/app.constants';

@Component({
  selector: 'app-ff-custom-tab',
  templateUrl: './ff-custom-tab.component.html',
  styleUrls: ['./ff-custom-tab.component.scss'],
})
export class FairFoodCustomTabComponent implements OnChanges, OnDestroy {
  @Input() tabGroupItems: TabItem[];
  @Input() activeTabId: string;
  @Input() stockProcess: boolean;

  @Output() tabChanged = new EventEmitter();

  tabList: any[];

  ngOnChanges(changes: SimpleChanges): void {
    const { tabGroupItems } = changes;
    if (tabGroupItems) {
      this.tabList = tabGroupItems.currentValue;
    }
  }
  changeTab(tabItem: TabItem): void {
    if (this.stockProcess) {
      tabItem.active ? this.tabChanged.emit(tabItem) : console.log('Disabled');
    } else {
      this.tabChanged.emit(tabItem);
    }
  }

  ngOnDestroy(): void {
    this.tabGroupItems = [];
  }
}
