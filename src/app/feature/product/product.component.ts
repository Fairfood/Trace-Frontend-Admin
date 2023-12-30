/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
// services and configs
import {
  PRODUCT_COLUMNS,
  SEARCHBY_OPTIONS,
} from 'src/app/core/utils/app.constants';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: any[] = PRODUCT_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  searchBy: any[] = SEARCHBY_OPTIONS;
  loading = true;
  toggleFilter: boolean;
  supplyChainList: any;

  constructor(
    private productService: ProductService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
      selectedSupplyChain: '',
    };
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.getSupplyChains();
  }

  loadProducts(): void {
    this.loading = true;
    this.productList();
  }

  getSupplyChains(): void {
    const api = this.dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.productList();
      });

    this.pageApis.push(api);
  }

  productList(): void {
    this.dataSource = [];
    const { limit, offset, searchString, selectedSupplyChain } =
      this.appliedFilters;
    const api = this.productService
      .getProductList(searchString, offset, limit, selectedSupplyChain)
      .subscribe(
        result => {
          const { results, count } = result;
          this.totalCount = count;
          this.dataSource = results;
          this.loading = false;
        },
        () => {
          this.dataSource = [];
          this.loading = false;
        }
      );
    this.pageApis.push(api);
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.appliedFilters.selectedSupplyChain = '';
      this.loadProducts();
    }
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.appliedFilters.limit = limit;
    this.appliedFilters.offset = offset;
    this.loadProducts();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadProducts();
  }

  otherFilters(data: any): void {
    const selected = data.id === 'All' ? '' : data.id;
    this.appliedFilters.selectedSupplyChain = selected;
    this.loadProducts();
  }

  createProduct(isEdit?: boolean, item?: any): void {
    const dialogRef = this.dialog.open(ProductCreateComponent, {
      disableClose: true,
      minWidth: '50vw',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: {
        supplyChainData: this.supplyChainList,
        isEdit: isEdit ?? false,
        productData: item,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
