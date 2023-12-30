/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { ACTION_TYPE, TabItem } from 'src/app/core/utils/app.constants';
import { CLAIM_TABS, EVIDENCE_TYPE, CLAIM_TABS_COMPANY } from '../claim.config';
import { ClaimService } from '../claim.service';

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss'],
})
export class CreateClaimComponent implements OnInit, OnDestroy {
  @Output() navigationBack = new EventEmitter();

  basicsForm: FormGroup;
  evidenceForm: FormGroup;
  propsForm: FormGroup;

  tabGroup: TabItem[];
  activeTabId: string;
  pageApis: Subscription[] = [];
  supplyChainList: any[];
  submitted = false;
  dataLoaded: boolean;
  verifierList: any[] = [];
  evidenceDropdown = EVIDENCE_TYPE;

  loaderText = 'Loading data';
  claimId: any;
  productClaim = true;
  submitButtonText = 'Continue';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private claimService: ClaimService
  ) {
    this.activeTabId = CLAIM_TABS[0].id;
    this.basicsForm = this.fb.group({
      name: ['', Validators.required],
      type: [1, Validators.required],
      supplyChain: ['', Validators.required],
      shortDesc: ['', Validators.required],
      longDesc: ['', Validators.required],
      companyDesciption: [''],
      assignVerifier: [false],
      verifier: [''],
    });

    this.evidenceForm = this.fb.group({
      evidenceRow: this.fb.array([this.initEvidenceRows(1)]),
    });

    this.propsForm = this.fb.group({
      inheritable: [false],
      inheritanceType: [1],
      isPropotional: [false],
      isRemovable: [false],
      claimVerificationType: [1],
      thirdPartyType: [''],
      verifiers: [''],
    });
    this.tabGroup = JSON.parse(JSON.stringify(CLAIM_TABS));
  }

  ngOnInit(): void {
    this.getSupplyChains();

    /**
     * Switching between product and company claim
     */
    const formChange = this.basicsForm
      .get('type')
      .valueChanges.subscribe(val => {
        if (val === 1) {
          this.basicsForm.get('supplyChain').setValidators(Validators.required);
          this.basicsForm.get('shortDesc').setValidators(Validators.required);
          this.basicsForm.get('longDesc').setValidators(Validators.required);
          this.basicsForm.get('companyDesciption').clearValidators();
          this.basicsForm.get('companyDesciption').patchValue('');
          this.basicsForm.get('assignVerifier').patchValue(false);
          this.productClaim = true;
          this.tabGroup = JSON.parse(JSON.stringify(CLAIM_TABS));
        } else {
          this.basicsForm
            .get('companyDesciption')
            .setValidators(Validators.required);
          this.basicsForm.get('assignVerifier').patchValue(false);
          this.basicsForm.get('shortDesc').clearValidators();
          this.basicsForm.get('longDesc').clearValidators();
          this.basicsForm.get('supplyChain').clearValidators();
          this.productClaim = false;
          this.tabGroup = JSON.parse(JSON.stringify(CLAIM_TABS_COMPANY));
        }
        this.basicsForm.updateValueAndValidity();
      });
    const formChange2 = this.basicsForm
      .get('assignVerifier')
      .valueChanges.subscribe(val => {
        if (val) {
          this.basicsForm.get('verifier').setValidators(Validators.required);
        } else {
          this.basicsForm.get('verifier').clearValidators();
        }
        setTimeout(() => {
          this.basicsForm.updateValueAndValidity();
        });
      });

    const radioChange = this.propsForm
      .get('thirdPartyType')
      .valueChanges.subscribe(val => {
        if (val === 1) {
          this.propsForm.get('verifiers').setValidators(Validators.required);
        } else {
          this.propsForm.get('verifiers').clearValidators();
        }
        setTimeout(() => {
          this.propsForm.updateValueAndValidity();
        });
      });
    this.pageApis.push(formChange);
    this.pageApis.push(formChange2);
    this.pageApis.push(radioChange);
  }

  getSupplyChains(): void {
    const api = this.dataService.fetchAllSupplyChains('').subscribe(
      (res: any) => {
        this.supplyChainList = res;
        this.getCompanyVerifiers();
      },
      () => {
        this.getCompanyVerifiers();
      }
    );

    this.pageApis.push(api);
  }

  getCompanyVerifiers(): void {
    const api = this.claimService.getVerifiers('').subscribe(
      (res: any) => {
        this.verifierList = res.results;
        this.dataLoaded = true;
      },
      () => {
        this.dataLoaded = true;
      }
    );

    this.pageApis.push(api);
  }

  /**
   * It determines the type of evidence text field or dropdown or file input
   * type 1 - input/dropdown field
   * type 3 - file upload field
   * @param type number
   * @returns FormGroup
   */
  initEvidenceRows(type: number): FormGroup {
    //input field
    if (type === 1) {
      return this.fb.group({
        name: ['', Validators.required],
        options: this.fb.array([]),
        fieldType: [1],
      });
    } else {
      // file type
      return this.fb.group({
        name: ['', Validators.required],
        fieldType: [3],
      });
    }
  }
  /**
   * To initialise form control options for dropdown
   * Dropdown is selected from field type then values for the dropdown can be entered
   * @returns FormControl
   */
  initOptions(): FormControl {
    return this.fb.control('', Validators.required);
  }

  // remove evidence row
  deleteEvidenceRow(index: number): void {
    this.evidenceFormArray.removeAt(index);
  }

  get evidenceFormArray() {
    return this.evidenceForm.get('evidenceRow') as FormArray;
  }

  /**
   * Getting options dropdown form array
   * @param form any
   * @returns any
   */
  getControls(form: any): any {
    return form.controls.options.controls;
  }

  /**
   * type 1 or 3
   * Adding rows either input field or file type
   * @param type number
   */
  addEvidenceRow(type: number): void {
    this.evidenceFormArray.push(this.initEvidenceRows(type));
  }

  changeTab(data: TabItem): void {
    // user is in first tab
    if (this.activeTabId === CLAIM_TABS[0].id) {
      if (data?.id === CLAIM_TABS[1].id) {
        if (this.basicsForm.valid) {
          this.activeTabId = data.id;
        }
      }
      if (data?.id === CLAIM_TABS[2].id && this.productClaim) {
        if (this.basicsForm.valid) {
          if (this.evidenceForm.valid) {
            this.activeTabId = data.id;
          } else {
            this.activeTabId = CLAIM_TABS[1].id;
          }
        } else {
          this.submitted = true;
        }
      }
    }
    if (this.activeTabId === CLAIM_TABS[1].id) {
      if (this.evidenceForm.valid) {
        this.activeTabId = data.id;
      }
    }

    if (this.activeTabId === CLAIM_TABS[2].id) {
      if (this.propsForm.valid) {
        this.activeTabId = data.id;
      }
    }
  }

  backToListing(): void {
    if (this.activeTabId === CLAIM_TABS[0].id) {
      this.navigationBack.emit();
    } else if (this.activeTabId === CLAIM_TABS[1].id) {
      this.activeTabId = CLAIM_TABS[0].id;
    } else {
      this.activeTabId = CLAIM_TABS[1].id;
    }
  }

  continue(): void {
    this.submitted = true;
    if (this.activeTabId === CLAIM_TABS[0].id) {
      if (this.basicsForm.valid) {
        this.activeTabId = CLAIM_TABS[1].id;
        this.tabGroup[1].active = true;
        this.submitted = false;
      }
    } else if (this.activeTabId === CLAIM_TABS[1].id) {
      if (this.evidenceForm.valid) {
        if (!this.productClaim) {
          this.createClaim();
        } else {
          this.activeTabId = CLAIM_TABS[2].id;
          this.tabGroup[2].active = true;
          this.submitted = false;
        }
      }
    } else {
      if (this.propsForm.valid) {
        this.submitted = false;
        this.createClaim();
      }
    }
  }

  /**
   * Using for multiple select dropdown ( For supply chain selection and verifier selection )
   * @param value any[]
   * @param type string
   */
  dropdownFormValue(value: any[], type: string): void {
    this.basicsForm.get(type).setValue(value);
  }

  /**
   * Field type dropdown change rowsie
   * two options are there dropdown or textfield
   * if dropdown is selected the field type will be set to 2
   * and additional input fields to enter dropdown options values will be enabled
   * @param value any
   * @param i number
   */
  fieldTypeUpdate(value: any, i: number) {
    this.evidenceFormArray.controls[i].get('fieldType').setValue(value.id);
    if (value.id === 2) {
      this.getOptions(i).push(this.initOptions());
    } else {
      // reseting options field to empty array
      this.removeOptionsField(i);
    }
  }

  removeOptionsField(i: number): void {
    const val = this.evidenceFormArray.controls[i].value;
    val?.options.filter((index: number) => {
      setTimeout(() => {
        this.getOptions(i).removeAt(index);
      }, 200);
    });
  }

  /**
   * Deleting the option value field corresponding `i` th row
   * @param i number
   * @param j number
   */
  deleteOption(i: number, j: number): void {
    this.getOptions(i).removeAt(j);
  }

  // add new option field
  addOptionsField(i: number): void {
    this.getOptions(i).push(this.initOptions());
  }

  /**
   * Getting options form array
   * @param i number
   * @returns FormArray
   */
  getOptions(i: number) {
    return this.evidenceFormArray.at(i).get('options') as FormArray;
  }

  /**
   * @param value any[]
   * @param type string
   */
  dropdownFormValueThirdParty(value: any[]): void {
    this.propsForm.get('verifiers').setValue(value);
  }

  /**
   * Creating claim
   */
  createClaim(): void {
    this.loaderText = 'Creating claim';
    this.dataLoaded = false;
    const {
      name,
      type,
      shortDesc: description_basic,
      longDesc,
      companyDesciption,
      supplyChain,
    } = this.basicsForm.value;
    const claimAddReq: any = {
      name,
      type,
      description_basic,
      description_full: type === 1 ? longDesc : companyDesciption,
    };
    if (type === 1) {
      claimAddReq['supply_chains'] = supplyChain.map((m: any) => m.id);
    }
    const api = this.claimService
      .createClaim(claimAddReq)
      .subscribe((res: any) => {
        const { data } = res;
        this.claimId = data.id;
        const criterions = {
          claim: data.id,
          criterion: [
            {
              name: data.name,
              description: data.description_full,
            },
          ],
        };
        const api2 = this.claimService
          .addClaimCriterion(criterions)
          .subscribe((result: any) => {
            if (result.success) {
              this.addEvidence(result.data.id);
            }
          });
        this.pageApis.push(api2);
      });
    this.pageApis.push(api);
  }

  /**
   * Adding evidence
   * @param creiteriaId string
   */
  addEvidence(creiteriaId: string): void {
    const result = this.claimService.evidenceObject(
      this.evidenceForm.value.evidenceRow,
      creiteriaId
    );
    const evidenceParam = { criterion_field: result };
    if (result.length > 0) {
      const api = this.claimService
        .addClaimCriterionFields(evidenceParam)
        .subscribe({
          next: () => {
            const message = 'Evidence created successfully';
            this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
          },
          error: () => {
            const message = 'Failed to add evidence';
            this.dataService.customSnackBar(message, ACTION_TYPE.FAILED);
          },
        });
      this.pageApis.push(api);
    }
    const { type } = this.basicsForm.value;
    if (type == 1) {
      this.patchClaimDetails();
    } else {
      // if company claim there is no other configuration to save
      const message = 'Claim created successfully';
      this.submitted = false;
      this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
      this.dataLoaded = true;
      this.navigationBack.emit('reload');
    }
  }

  // product claim saving
  patchClaimDetails(): void {
    const {
      inheritable,
      isPropotional,
      isRemovable,
      claimVerificationType,
      thirdPartyType,
      verifiers,
      inheritanceType,
    } = this.propsForm.value;

    const isInheritable = inheritable ? inheritanceType : 2;
    const params: any = {
      proportional: isPropotional,
      removable: isRemovable,
      inheritable: isInheritable,
      verified_by: claimVerificationType,
      verifiers: [],
    };
    if (claimVerificationType === 2 && thirdPartyType === 1) {
      params.verifiers = verifiers;
    } else {
      params.verifiers = [];
    }
    const apiCall = this.claimService
      .updateClaim(this.claimId, params)
      .subscribe({
        next: (res: any) => {
          this.dataLoaded = true;
          if (res.success) {
            const message = 'Claim created successfully';
            this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
            this.navigationBack.emit('reload');
          }
          this.submitted = false;
        },
        error: () => {
          const message = 'Failed to create claim';
          this.dataService.customSnackBar(message, ACTION_TYPE.FAILED);
          this.navigationBack.emit();
        },
      });
    this.pageApis.push(apiCall);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
