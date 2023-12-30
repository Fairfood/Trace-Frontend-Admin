/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
// services and configs
import { DataService } from 'src/app/core/data.service';
import { FeatureService } from '../../feature.service';
import { ACTION_TYPE } from 'src/app/core/utils/app.constants';

@Component({
  selector: 'app-create-supply-chain',
  templateUrl: './create-supply-chain.component.html',
  styleUrls: ['./create-supply-chain.component.scss'],
})
export class CreateSupplyChainComponent implements OnDestroy, OnInit {
  apiSub: Subscription;
  supplyForm: FormGroup;
  submitted: boolean;
  pageApis: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateSupplyChainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private featureService: FeatureService
  ) {}

  ngOnInit(): void {
    const { name, isEdit } = this.data;

    this.supplyForm = new FormGroup({
      name: new FormControl(isEdit ? name : '', Validators.required),
    });

    this.supplyForm.updateValueAndValidity();
  }

  close() {
    this.dialogRef.close();
  }

  createSupplyChain(): void {
    this.submitted = true;

    if (this.supplyForm.valid) {
      const { name } = this.supplyForm.value;
      const api = this.featureService
        .getsupplyChainList(name, 1, 0)
        .subscribe((res: any) => {
          const { results } = res;
          if (results.length === 0) {
            this.supplyForm.get('name').setErrors(null);
            this.apiCall(name);
          } else {
            if (results[0].name === name) {
              this.supplyForm.get('name').setErrors({ duplicate: true });
            } else {
              this.supplyForm.get('name').setErrors(null);
              this.apiCall(name);
            }
          }
        });
      this.pageApis.push(api);
    }
  }

  apiCall(name: string): void {
    const params: any = {
      req: {
        name,
      },
      isEdit: this.data.isEdit,
    };

    if (this.data.isEdit) {
      params.id = this.data.id;
    }
    const api = this.dataService.createSupplyChain(params).subscribe(res => {
      if (res.success) {
        const message = this.data.isEdit
          ? 'Supply chain name updated'
          : 'Supply chain created';
        this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
        this.dataService.availableSupplyChains = [];
        this.dataService.fetchAllSupplyChains('').subscribe();
        this.dialogRef.close(true);
      } else {
        this.dataService.customSnackBar(
          'Something went wrong!',
          ACTION_TYPE.FAILED
        );
      }
    });

    this.pageApis.push(api);
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m?.unsubscribe);
  }
}
