/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
// services and configs
import { ACTION_TYPE } from 'src/app/shared/configs/app.constants';
import { ProductService } from '../product/product.service';
// components
import {
  FairFoodInputComponent,
  FfDropdownComponent,
} from 'fairfood-form-components';
import { ButtonsComponent } from 'fairfood-utils';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    FfDropdownComponent,
    FairFoodInputComponent,
    ButtonsComponent,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  apiSub: Subscription;
  productCreateForm: FormGroup;
  submitted: boolean;
  pageApis: Subscription[] = [];
  disabled: boolean;
  buttonText = '';
  dataLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<ProductCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productService: ProductService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const { isEdit, productData } = this.data;
    this.productCreateForm = this.fb.group({
      id: [''],
      supplyChain: ['', Validators.required],
      product: ['', Validators.required],
      description: [''],
      productImage: [null],
      productImageName: [''],
    });
    if (isEdit) {
      const { supply_chain, name, image_name, description, id } = productData;
      this.productCreateForm.patchValue({
        supplyChain: supply_chain.id,
        product: name,
        productImageName: image_name,
        description,
        id,
      });
      this.buttonText = 'Update product';
    } else {
      this.buttonText = 'Create product';
    }

    this.productCreateForm.updateValueAndValidity();
    this.dataLoaded = true;
  }

  close() {
    this.dialogRef.close();
  }

  selectSupplychain(data: any): void {
    const selected = data.id === 'All' ? '' : data.id;
    this.productCreateForm.get('supplyChain').setValue(selected);
  }

  afterFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const idxDot = file.name.lastIndexOf('.') + 1;
      const extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
      if (
        extFile == 'jpg' ||
        extFile == 'jpeg' ||
        extFile == 'png' ||
        extFile == 'svg' ||
        extFile == 'gif'
      ) {
        this.productCreateForm.get('productImage').setValue(file);
        this.productCreateForm.get('productImageName').setValue(file.name);
      }
    }
  }

  checkProductName(): void {
    const { product, supplyChain } = this.productCreateForm.value;

    if (this.data.isEdit && product === this.data.productData?.name) {
      this.productCreateForm.get('product').setErrors(null);
      this.buttonText = 'Updating product';
      this.apiCall();
    } else {
      const api = this.productService
        .getProductList(product, 0, 1, supplyChain)
        .subscribe((res: any) => {
          const { results } = res;

          if (results.length && results[0].name === product) {
            this.productCreateForm
              .get('product')
              .setErrors({ duplicate: true });
            this.disabled = false;
          } else {
            this.productCreateForm.get('product').setErrors(null);
            this.buttonText = this.data.isEdit
              ? 'Updating product'
              : 'Creating product';
            this.apiCall();
          }
        });
      this.pageApis.push(api);
    }
  }

  createProduct(): void {
    this.buttonText = 'Verifying product name';
    this.submitted = true;
    if (this.productCreateForm.valid) {
      this.disabled = true;
      this.checkProductName();
    } else {
      this.resetButtonText();
    }
  }

  apiCall(): void {
    const { product, supplyChain, description, productImage, id } =
      this.productCreateForm.value;
    const formData = new FormData();
    formData.append('supply_chain', supplyChain);
    formData.append('name', product);
    formData.append('description', description);
    if (productImage) {
      formData.append('image', productImage);
    }

    const params: any = {
      req: formData,
      isEdit: this.data.isEdit,
    };

    if (this.data.isEdit) {
      params.id = id;
    }

    const api = this.productService.createProduct(params).subscribe(
      (res: any) => {
        this.disabled = false;
        this.dataService.customSnackBar(
          `Product ${this.data.isEdit ? 'updated' : 'created'} successfully`,
          ACTION_TYPE.SUCCESS
        );
        this.resetButtonText();
        this.dialogRef.close(res);
      },
      () => {
        this.dataService.customSnackBar(
          'Something went wrong!',
          ACTION_TYPE.FAILED
        );
        this.resetButtonText();
      }
    );
    this.pageApis.push(api);
  }

  resetButtonText(): void {
    this.buttonText = this.data.isEdit ? 'Update product' : 'Create product';
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m?.unsubscribe);
  }
}
