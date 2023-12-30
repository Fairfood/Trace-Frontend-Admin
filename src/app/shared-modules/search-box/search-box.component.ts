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

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('ffSearchInput', { static: true }) ffSearchInput: ElementRef;

  @Input() placeholder: string;
  @Input() searchByOptions: any[];
  @Input() hideOptions: boolean;

  @Output() searchText = new EventEmitter();
  keyword: string;
  sub: Subscription[] = [];
  supplyChainId = localStorage.getItem('supplyChainId');
  searchByOption: any;

  ngOnInit(): void {
    if (!this.hideOptions) {
      this.searchByOption = this.searchByOptions[0];
    }
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
