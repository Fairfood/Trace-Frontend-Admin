/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { CompanyProfileService } from '../company-profile.service';

@Component({
  selector: 'app-add-supply-chain',
  templateUrl: './add-supply-chain.component.html',
  styleUrls: ['./add-supply-chain.component.scss'],
})
export class AddSupplyChainComponent implements OnInit {
  supplyChainForm: FormGroup;
  supplyChainList: any;
  pageApis: Subscription[] = [];
  operationList: any;
  dataLoaded: boolean;
  submitted: boolean;
  loaderText = 'Loading supply chains';
  duplicateError: boolean;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSupplyChainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private cService: CompanyProfileService
  ) {
    this.supplyChainForm = this.fb.group({
      items: this.fb.array([this.createForm()]),
    });
    this.operationList = [];
  }

  ngOnInit(): void {
    this.getSupplyChains();
  }
  getSupplyChains(): void {
    const api = this.cService
      .supplychainListForCompanies(this.data.id)
      .subscribe((res: any) => {
        this.supplyChainList = res.results;
        this.dataLoaded = true;
      });

    this.pageApis.push(api);
  }

  getOperations(id: string, i: number): void {
    const api = this.dataService
      .getoperationsBySupplyChains(id)
      .subscribe((res: any) => {
        const { results } = res;
        this.operationList[i] = [];
        this.operationList[i] = JSON.parse(JSON.stringify(results));
      });
    this.pageApis.push(api);
  }

  addMore(): void {
    this.supplyChains.push(this.createForm());
    this.operationList.push([]);
  }

  removeField(index: number): void {
    this.supplyChains.removeAt(index);
    this.operationList.splice(index, 1);
    this.checkDuplicateSupplyChain();
  }

  get supplyChains(): any {
    return this.supplyChainForm.get('items') as FormArray;
  }

  dropdownFormValue(value: any, label: string, index: number): void {
    const selected = value.id === 'All' ? '' : value.id;
    if (label === 'type') {
      this.supplyChains.at(index).get('companyType').setValue(selected);
    } else {
      this.supplyChains.at(index).get('supplyChain').setValue(selected);
      this.supplyChains.at(index).get('companyType').setValue('');
      if (selected) {
        this.getOperations(selected, index);
      } else {
        this.operationList[index] = [];
      }
    }
  }

  // method to create dynamic form
  createForm(): FormGroup {
    return this.fb.group({
      supplyChain: ['', Validators.required],
      companyType: ['', Validators.required],
    });
  }

  checkDuplicateSupplyChain(): void {
    const { items } = this.supplyChainForm.value;
    const supplyChainIds = items.map((i: any) => i.supplyChain);
    const toFindDuplicates = (arry: string[]) =>
      arry.filter(
        (item: string, index: number) => arry.indexOf(item) !== index
      );
    const duplicateElements = toFindDuplicates(supplyChainIds);
    if (duplicateElements.length) {
      this.duplicateError = true;
    } else {
      this.duplicateError = false;
    }
  }

  addSupplyChain(): void {
    this.submitted = true;
    if (this.supplyChainForm.valid) {
      this.checkDuplicateSupplyChain();

      if (!this.duplicateError) {
        this.dataLoaded = false;
        this.loaderText =
          'Adding supply chain to the company. Please wait . . . ';

        const supplyChains = this.supplyChainForm.value.items.map(
          (item: any) => {
            return {
              supply_chain: item.supplyChain,
              primary_operation: item.companyType,
            };
          }
        );

        const params = { supply_chains: supplyChains };
        const api = this.cService
          .addActiveSupplyChains(this.data.id, params)
          .subscribe(result => {
            this.dataLoaded = true;
            if (result.success) {
              this.dialogRef.close(true);
            }
          });
        this.pageApis.push(api);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m?.unsubscribe);
  }
}
