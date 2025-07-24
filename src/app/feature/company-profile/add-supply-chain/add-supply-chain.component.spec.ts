import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSupplyChainComponent } from './add-supply-chain.component';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { CompanyProfileService } from '../company-profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('AddSupplyChainComponent', () => {
  let component: AddSupplyChainComponent;
  let fixture: ComponentFixture<AddSupplyChainComponent>;
  let dataServiceMock: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    dataServiceMock = jasmine.createSpyObj('DataService', [
      'getoperationsBySupplyChains',
    ]);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: { id: '123' } },
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        { provide: DataService, useValue: dataServiceMock },
        {
          provide: CompanyProfileService,
          useValue: { supplychainListForCompanies: () => of({ results: [] }) },
        },
      ],
      declarations: [AddSupplyChainComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update operationList when getOperations is called', () => {
    // Arrange: Prepare mock data
    const mockOperations = [
      { id: '1', name: 'Operation 1' },
      { id: '2', name: 'Operation 2' },
    ];
    dataServiceMock.getoperationsBySupplyChains.and.returnValue(
      of({ results: mockOperations })
    );

    // Prepare the operationList with empty array
    component.operationList = [[]];

    // Act: Call getOperations method with sample id and index
    const supplyChainId = 'some-id';
    const index = 0;
    component.getOperations(supplyChainId, index);

    // Assert: Check that operationList was updated correctly
    expect(component.operationList[index]).toEqual(mockOperations);
    expect(dataServiceMock.getoperationsBySupplyChains).toHaveBeenCalledWith(
      supplyChainId
    );
  });

  it('should add a new supply chain and operation list when addMore is called', () => {
    // Arrange: Set initial values for supplyChains and operationList
    const initialSupplyChainsLength = component.supplyChains.length;
    const initialOperationListLength = component.operationList.length;

    // Act: Call addMore method
    component.addMore();

    // Assert: Check that a new form has been added to supplyChains and operationList
    expect(component.supplyChains.length).toBe(initialSupplyChainsLength + 1);
    expect(component.operationList.length).toBe(initialOperationListLength + 1);
    expect(component.operationList[component.operationList.length - 1]).toEqual(
      []
    );
    expect(
      component.supplyChains.at(component.supplyChains.length - 1).valid
    ).toBeFalse(); // Form is invalid initially
  });

  it('should update form values and call getOperations when dropdownFormValue is called', () => {
    // Arrange: Mock initial values
    const mockValue = { id: '123' }; // Some valid supply chain ID
    const labelType = 'type';
    const labelSupplyChain = 'supplyChain';
    const index = 0;

    // Spy on getOperations method to ensure it's called when needed
    spyOn(component, 'getOperations');

    // Act: Call dropdownFormValue with 'type' label
    component.dropdownFormValue(mockValue, labelType, index);

    // Assert: Check that 'companyType' was updated
    expect(component.supplyChains.at(index).get('companyType').value).toBe(
      mockValue.id
    );

    // Act: Call dropdownFormValue with 'supplyChain' label
    component.dropdownFormValue(mockValue, labelSupplyChain, index);

    // Assert: Check that 'supplyChain' was updated
    expect(component.supplyChains.at(index).get('supplyChain').value).toBe(
      mockValue.id
    );

    // Assert: 'companyType' should be cleared
    expect(component.supplyChains.at(index).get('companyType').value).toBe('');

    // Assert: getOperations should be called for valid selected supply chain
    expect(component.getOperations).toHaveBeenCalledWith(mockValue.id, index);

    // Act: Call dropdownFormValue with 'All' id to test clearing operation list
    const allValue = { id: 'All' };
    component.dropdownFormValue(allValue, labelSupplyChain, index);

    // Assert: 'supplyChain' should be cleared
    expect(component.supplyChains.at(index).get('supplyChain').value).toBe('');

    // Assert: 'companyType' should be cleared
    expect(component.supplyChains.at(index).get('companyType').value).toBe('');

    // Assert: operationList for this index should be cleared
    expect(component.operationList[index]).toEqual([]);
  });
});
