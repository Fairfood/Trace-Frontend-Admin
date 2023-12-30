/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
// services and configs
import { ACTION_TYPE } from 'src/app/core/utils/app.constants';
import { DataService } from 'src/app/core/data.service';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit, OnDestroy {
  basicsForm: FormGroup;
  submitted: boolean;
  dataLoaded: boolean;
  disabled: boolean;
  pageApis: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditClaimComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private claimService: ClaimService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const { type, supply_chains, name, description_basic, description_full } =
      this.data.claimData;

    if (this.data.claimData.type === 1) {
      this.basicsForm = this.fb.group({
        name: [name, Validators.required],
        supplyChain: [supply_chains, Validators.required],
        shortDesc: [description_basic, Validators.required],
        longDesc: [description_full, Validators.required],
        type: [type],
      });
    } else {
      this.basicsForm = this.fb.group({
        name: [name, Validators.required],
        longDesc: [description_full, Validators.required],
        type: [type],
      });
    }
    this.dataLoaded = true;
  }

  close() {
    this.dialogRef.close();
  }

  selectSupplychain(data: any): void {
    this.basicsForm.get('supplyChain').setValue(data);
  }

  updateClaim(): void {
    this.submitted = true;
    if (this.basicsForm.valid) {
      const {
        name,
        type,
        shortDesc: description_basic,
        longDesc,
        supplyChain,
      } = this.basicsForm.value;
      const claimAddReq: any = {
        name,
        type,
        description_basic,
        description_full: longDesc,
      };
      if (type === 1) {
        claimAddReq['supply_chains'] = supplyChain.map((m: any) => m.id);
      }
      const api = this.claimService
        .updateClaim(this.data.claimData.id, claimAddReq)
        .subscribe((res: any) => {
          if (res.success) {
            this.dataService.customSnackBar(
              'Claim details updated',
              ACTION_TYPE.SUCCESS
            );
            this.dialogRef.close(true);
          }
        });
      this.pageApis.push(api);
    }
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m.unsubscribe());
  }
}
