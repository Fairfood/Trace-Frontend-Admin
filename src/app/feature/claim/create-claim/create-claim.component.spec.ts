import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateClaimComponent } from './create-claim.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ClaimService } from '../claim.service';
import { of } from 'rxjs';
import { TabItem } from 'src/app/shared/configs/app.constants';
import { CLAIM_TABS } from '../claim.config';

describe('CreateClaimComponent', () => {
  let component: CreateClaimComponent;
  let fixture: ComponentFixture<CreateClaimComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let claimService: jasmine.SpyObj<ClaimService>;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'fetchAllSupplyChains',
      'customSnackBar',
    ]);
    const claimServiceSpy = jasmine.createSpyObj('ClaimService', [
      'getVerifiers',
      'createClaim',
      'addClaimCriterion',
      'addClaimCriterionFields',
      'updateClaim',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CreateClaimComponent],
      providers: [
        FormBuilder,
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ClaimService, useValue: claimServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClaimComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    claimService = TestBed.inject(ClaimService) as jasmine.SpyObj<ClaimService>;

    // Initializing mock service responses
    dataService.fetchAllSupplyChains.and.returnValue(of([]));
    claimService.getVerifiers.and.returnValue(of({ results: [] }));
    claimService.createClaim.and.returnValue(of({ data: { id: '123' } }));
    claimService.addClaimCriterion.and.returnValue(of({ success: true }));
    claimService.addClaimCriterionFields.and.returnValue(of({ success: true }));
    claimService.updateClaim.and.returnValue(of({ success: true }));
    spyOn(component, 'getOptions').and.returnValue(
      new FormArray([new FormControl('option1'), new FormControl('option2')])
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    component.basicsForm.setValue({
      name: 'Test Claim',
      type: 1, // Set a default value for type
      supplyChain: ['Test Supply Chain'],
      shortDesc: 'Short description',
      longDesc: 'Long description',
      companyDesciption: '',
      assignVerifier: false,
      verifier: '',
    });
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    expect(component.basicsForm).toBeTruthy();
    expect(component.evidenceForm).toBeTruthy();
    expect(component.propsForm).toBeTruthy();
  });

  it('should call getSupplyChains on ngOnInit', () => {
    component.ngOnInit();
    expect(dataService.fetchAllSupplyChains).toHaveBeenCalled();
  });

  it('should call getCompanyVerifiers after supply chains are fetched', () => {
    component.getSupplyChains();
    expect(claimService.getVerifiers).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
    spyOn(component.pageApis, 'forEach');
    component.ngOnDestroy();
    expect(component.pageApis.forEach).toHaveBeenCalled();
  });

  it('should create initOptions form control with required validator', () => {
    // Call the initOptions method
    const control = component.initOptions();

    // Assert that it is a FormControl
    expect(control instanceof FormControl).toBe(true);

    // Assert that the control has the 'required' validator
    const validators = control.validator ? [control.validator] : [];
    expect(validators.length).toBeGreaterThan(0);

    // Create a mock validation function to check if it's a 'required' validator
    const requiredValidator = validators[0]({} as any);
    expect(requiredValidator).toEqual({ required: true });
  });

  it('should remove the evidence row at the specified index', () => {
    // Initialize evidence rows
    component.evidenceFormArray.push(component.initEvidenceRows(1));
    component.evidenceFormArray.push(component.initEvidenceRows(3));

    expect(component.evidenceFormArray.length).toBe(3); // Includes the default row initialized in ngOnInit

    // Delete the second row (index 1)
    component.deleteEvidenceRow(1);

    // Assert that the row is removed
    expect(component.evidenceFormArray.length).toBe(2); // Now only 2 rows remain
    expect(component.evidenceFormArray.at(1).value.fieldType).toBe(3); // The second row should now have fieldType 3
  });

  it('should return the controls of the options FormArray from the given form', () => {
    // Mock a form with a nested options FormArray
    const mockForm = {
      controls: {
        options: {
          controls: ['control1', 'control2', 'control3'], // Mock controls
        },
      },
    };

    // Call the getControls method with the mock form
    const controls = component.getControls(mockForm);

    // Assert that the returned controls match the mocked controls
    expect(controls).toEqual(['control1', 'control2', 'control3']);
  });

  it('should add a new evidence row to the evidenceFormArray', () => {
    // Create a mock FormGroup to match the expected type
    const mockFormGroup = new FormGroup({
      field1: new FormControl(''),
      field2: new FormControl(''),
    });

    // Spy on the initEvidenceRows method to return the mock FormGroup
    spyOn(component, 'initEvidenceRows').and.returnValue(mockFormGroup);

    // Ensure evidenceFormArray is accessible (assuming it is a getter)
    spyOnProperty(component, 'evidenceFormArray', 'get').and.returnValue(
      new FormArray([])
    );

    // Call the method with a type parameter
    const type = 1; // Example type
    component.addEvidenceRow(type);

    // Assert that initEvidenceRows was called with the correct type
    expect(component.initEvidenceRows).toHaveBeenCalledWith(type);

    // Assert that the new FormGroup was added to the FormArray
    const formArray = component.evidenceFormArray;
    expect(formArray.length).toBe(1);
    expect(formArray.at(0)).toEqual(mockFormGroup);
  });

  it('should emit navigationBack when activeTabId is the first tab', () => {
    // Set initial activeTabId to the first tab
    component.activeTabId = CLAIM_TABS[0].id;

    // Spy on the navigationBack emitter
    spyOn(component.navigationBack, 'emit');

    // Call backToListing method
    component.backToListing();

    // Expect the navigationBack event to be emitted
    expect(component.navigationBack.emit).toHaveBeenCalled();
  });

  it('should change activeTabId to the first tab when activeTabId is the second tab', () => {
    // Set initial activeTabId to the second tab
    component.activeTabId = CLAIM_TABS[1].id;

    // Call backToListing method
    component.backToListing();

    // Expect the activeTabId to change to the first tab
    expect(component.activeTabId).toBe(CLAIM_TABS[0].id);
  });

  it('should change activeTabId to the second tab when activeTabId is not the first or second tab', () => {
    // Set initial activeTabId to the third tab
    component.activeTabId = CLAIM_TABS[2].id;

    // Call backToListing method
    component.backToListing();

    // Expect the activeTabId to change to the second tab
    expect(component.activeTabId).toBe(CLAIM_TABS[1].id);
  });

  it('should move to the second tab if activeTabId is the first tab and basicsForm is valid', () => {
    // Set initial activeTabId to the first tab
    component.activeTabId = CLAIM_TABS[0].id;
    component.basicsForm = new FormGroup({
      field1: new FormControl('valid', Validators.required),
    });

    // Spy on the tabGroup change and submitted status
    spyOn(component, 'createClaim');

    // Call continue method
    component.continue();

    // Check if the activeTabId has moved to the second tab
    expect(component.activeTabId).toBe(CLAIM_TABS[1].id);
    expect(component.submitted).toBeFalse();
    expect(component.tabGroup[1].active).toBeTrue();
  });

  it('should move to the third tab if activeTabId is the second tab and productClaim is true', () => {
    // Set initial activeTabId to the second tab
    component.activeTabId = CLAIM_TABS[1].id;
    component.evidenceForm = new FormGroup({
      field1: new FormControl('valid', Validators.required),
    });
    component.productClaim = true; // Set productClaim to true

    // Spy on the createClaim method
    spyOn(component, 'createClaim');

    // Call continue method
    component.continue();

    // Expect activeTabId to move to the third tab
    expect(component.activeTabId).toBe(CLAIM_TABS[2].id);
    expect(component.submitted).toBeFalse();
    expect(component.tabGroup[2].active).toBeTrue();
  });

  it('should call createClaim if activeTabId is the third tab and propsForm is valid', () => {
    // Set initial activeTabId to the third tab
    component.activeTabId = CLAIM_TABS[2].id;
    component.propsForm = new FormGroup({
      field1: new FormControl('valid', Validators.required),
    });

    // Spy on the createClaim method
    spyOn(component, 'createClaim');

    // Call continue method
    component.continue();

    // Expect createClaim to be called
    expect(component.createClaim).toHaveBeenCalled();
    expect(component.submitted).toBeFalse();
  });

  it('should set the value of the form control based on the type', () => {
    // Initialize the form with controls
    component.basicsForm = new FormGroup({
      field1: new FormControl(''),
      field2: new FormControl(''),
    });

    // Call the dropdownFormValue method with a value and a control type
    component.dropdownFormValue('newValue', 'field1');

    // Check if the value of the 'field1' control is updated to 'newValue'
    expect(component.basicsForm.get('field1')?.value).toBe('newValue');
  });

  it('should delete the option at the specified index', () => {
    // Initially, there are two options
    expect(component.getOptions(0).length).toBe(2);

    // Call deleteOption to remove the option at index 1
    component.deleteOption(0, 1);

    // Check that removeAt was called on the correct index
    expect(component.getOptions).toHaveBeenCalledWith(0);
    expect(component.getOptions(0).length).toBe(1); // One option should be removed
  });

  it('should set the value of the verifiers form control', () => {
    const mockValue = [
      { id: 1, name: 'Verifier 1' },
      { id: 2, name: 'Verifier 2' },
    ];

    // Call the dropdownFormValueThirdParty method with the mock value
    component.dropdownFormValueThirdParty(mockValue);

    // Verify that the value of the 'verifiers' form control is set correctly
    expect(component.propsForm.get('verifiers')?.value).toEqual(mockValue);
  });
});
