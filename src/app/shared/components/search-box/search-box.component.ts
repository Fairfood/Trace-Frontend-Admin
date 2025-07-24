/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

// libs
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
  ],
})
export class SearchBoxComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('ffSearchInput', { static: true }) ffSearchInput: ElementRef;

  @Input() placeholder: string;
  @Input() searchByOptions: any[];
  @Input() hideOptions: boolean;
  @Input() searchString: string;

  @Output() searchText = new EventEmitter();
  keyword: string;
  sub: Subscription[] = [];
  supplyChainId = localStorage.getItem('supplyChainId');
  searchByOption: any;

  ngOnInit(): void {
    if (!this.hideOptions) {
      this.searchByOption = this.searchByOptions[0];
    }
    this.keyword = this.searchString;
  }

  ngAfterViewInit(): void {
    const api = fromEvent(this.ffSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((res: any) => {
        this.searchText.emit(res);
      });

    this.sub.push(api);
  }

  ngOnDestroy(): void {
    this.sub?.map(m => m.unsubscribe());
  }
}
