/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { ACTION_TYPE, TabItem } from 'src/app/core/utils/app.constants';
import { CompanyProfileService } from '../../company-profile/company-profile.service';
import { COMPANY_ADDRESS, INVITE } from '../company.config';

@Component({
  selector: 'app-invite-company',
  templateUrl: './invite-company.component.html',
  styleUrls: ['./invite-company.component.scss'],
})
export class InviteCompanyComponent implements OnInit, OnDestroy {
  @Output() navigationBack = new EventEmitter();

  inviteForm: FormGroup;
  addressForm: FormGroup;

  tabGroup: any[] = INVITE;
  activeTabId: string;
  pageApis: Subscription[] = [];
  supplyChainList: any;
  operationList: any[] = [];
  submitted = false;
  countryList: any[];
  countryCodeList: { id: string; name: string }[];
  stateList: any[] = [];

  dataLoaded: boolean;

  companyFormDetails = COMPANY_ADDRESS;
  loaderText = 'Loading data';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private companyService: CompanyProfileService
  ) {
    this.activeTabId = INVITE[0].id;
    this.inviteForm = this.fb.group({
      name: ['', Validators.required],
      regNo: [''],
      items: this.fb.array([this.createForm()]),
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      latitude: [
        '0',
        [
          Validators.pattern(/^[-+]?[0-9]{1,7}(\.[0-9]+)?$/),
          Validators.min(-90),
          Validators.max(90),
        ],
      ],
      longitude: [
        '0',
        [
          Validators.pattern(/^[-+]?[0-9]{1,7}(\.[0-9]+)?$/),
          Validators.min(-180),
          Validators.max(180),
        ],
      ],
      zipcode: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      inEmail: ['', [Validators.required, Validators.email]],
      inDialCode: ['', Validators.required],
      inMobile: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^(?!0+$)[0-9]{1,15}$'),
        ],
      ],
    });
    this.operationList[0] = [];
  }

  ngOnInit(): void {
    this.getSupplyChains();
  }
  // method to create dynamic form
  createForm(): FormGroup {
    return this.fb.group({
      supplyChain: ['', Validators.required],
      companyType: ['', Validators.required],
      verifier: [false],
    });
  }

  getSupplyChains(): void {
    const api = this.dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.getCountries();
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
  }

  get supplyChains(): any {
    return this.inviteForm.get('items') as FormArray;
  }

  backToListing(): void {
    if (this.activeTabId === 'connection') {
      this.navigationBack.emit();
    } else {
      this.activeTabId = 'connection';
    }
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

  dropDownValueAddres(value: any, label: string): void {
    const selected = value.id === 'All' ? '' : value.id;
    this.addressForm.get(label).patchValue(selected);
    if (label === 'country') {
      this.addressForm.get('province').patchValue('');
      if (selected) {
        const countries = this.dataService.countries;
        const selectedSub = countries[value?.id].sub_divisions;
        this.setStateList(selectedSub);
      } else {
        this.stateList = [];
      }
    }
    if (label === 'province' && value?.latlong) {
      this.addressForm.patchValue({
        latitude: value.latlong[0],
        longitude: value.latlong[1],
      });
    }
  }

  continue(): void {
    if (this.activeTabId === 'connection') {
      this.submitted = true;
      if (this.inviteForm.valid) {
        this.activeTabId = INVITE[1].id;
        this.tabGroup[1].active = true;
        this.submitted = false;
      }
    } else {
      this.submitted = true;
      if (this.addressForm.valid) {
        this.inviteConnection();
      }
    }
  }

  inviteConnection(): void {
    this.dataLoaded = false;
    this.loaderText = 'Inviting connection';
    const {
      firstName,
      lastName,
      inEmail,
      inDialCode,
      inMobile,
      street,
      city,
      country,
      province,
      latitude,
      longitude,
      zipcode,
    } = this.addressForm.value;
    const { name, regNo } = this.inviteForm.value;
    const schainList: any[] = [];
    this.supplyChains.value.filter((item: any) => {
      schainList.push({
        supply_chain: item.supplyChain,
        primary_operation: item.companyType,
        verifier: item.verifier,
      });
    });
    const params: any = {
      name,
      identification_no: regNo,
      street,
      city,
      country,
      province,
      latitude,
      longitude,
      zipcode,
      supply_chains: schainList,
      incharge: {
        first_name: firstName,
        last_name: lastName,
        email: inEmail,
        phone: {
          dial_code: inDialCode,
          phone: inMobile,
        },
      },
    };
    const api = this.companyService.inviteCompany(params).subscribe(res => {
      if (res.success) {
        this.dataService.customSnackBar(
          'Connection invited successfully',
          ACTION_TYPE.SUCCESS
        );
        this.navigationBack.emit('reload');
      }
    });
    this.pageApis.push(api);
  }

  changeTab(data: TabItem): void {
    if (data.id === 'address') {
      if (this.inviteForm.valid) {
        this.activeTabId = data.id;
        this.submitted = false;
      } else {
        this.submitted = true;
      }
    } else {
      this.activeTabId = data.id;
    }
  }

  // Get all countries from API / local cache
  getCountries(): void {
    // check if country data is available in Data service
    if (this.dataService.countries) {
      this.setCountries(this.dataService.countries);
    } else {
      const api = this.dataService.getCountryList().subscribe((res: any) => {
        this.setCountries(res);
      });
      this.pageApis.push(api);
    }
  }

  // Method to set Country list
  setCountries(data: any): void {
    const result = this.companyService.formatCountries(data);
    this.countryList = result.countries;
    this.countryCodeList = result.codes;
    this.dataLoaded = true;
  }

  setStateList(selectedSub: any): void {
    this.stateList = Object.keys(selectedSub).map(key => {
      selectedSub[key].name = key;
      selectedSub[key].id = key;
      return selectedSub[key];
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
