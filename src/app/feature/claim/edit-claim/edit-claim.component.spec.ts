import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClaimComponent } from './edit-claim.component';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClaimService } from '../claim.service';
import { DataService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';

describe('EditClaimComponent', () => {
  let component: EditClaimComponent;
  let fixture: ComponentFixture<EditClaimComponent>;
  let claimService: ClaimService;
  let dataService: DataService;

  const mockDialogRef = { close: jasmine.createSpy('close') };
  const mockClaimData = {
    claimData: {
      id: 1,
      type: 1,
      name: 'Test Claim',
      supply_chains: [{ id: 1, name: 'Supply Chain 1' }],
      description_basic: 'Short Description',
      description_full: 'Long Description',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditClaimComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockClaimData },
        {
          provide: ClaimService,
          useValue: {
            updateClaim: jasmine
              .createSpy('updateClaim')
              .and.returnValue(of({ success: true })),
          },
        },
        {
          provide: DataService,
          useValue: { customSnackBar: jasmine.createSpy('customSnackBar') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditClaimComponent);
    component = fixture.componentInstance;
    claimService = TestBed.inject(ClaimService);
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly when data is provided', () => {
    expect(component.basicsForm).toBeTruthy();
    expect(component.basicsForm.get('name').value).toBe('Test Claim');
    expect(component.basicsForm.get('supplyChain').value).toEqual([
      { id: 1, name: 'Supply Chain 1' },
    ]);
  });

  it('should call updateClaim and close dialog on successful update', () => {
    component.updateClaim();
    expect(claimService.updateClaim).toHaveBeenCalled();
    expect(dataService.customSnackBar).toHaveBeenCalledWith(
      'Claim details updated',
      'Success'
    ); // Changed from 'SUCCESS' to 'Success'
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call close on dialog close', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
    // Create a mock subscription object
    const mockSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);

    // Add the mock subscription to the pageApis array
    component.pageApis.push(mockSubscription);

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Ensure unsubscribe was called on the mock subscription
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should update the supplyChain form control value when selectSupplychain is called', () => {
    // Mock data to pass into selectSupplychain
    const mockData = { id: 1, name: 'Supply Chain 1' };

    // Call the method with the mock data
    component.selectSupplychain(mockData);

    // Check if the supplyChain form control has been updated with the correct value
    expect(component.basicsForm.get('supplyChain').value).toEqual(mockData);
  });
});
