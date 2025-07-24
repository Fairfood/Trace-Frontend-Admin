import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveSupplyChainComponent } from './active-supply-chain.component';
import { CompanyProfileService } from '../company-profile.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AddSupplyChainComponent } from '../add-supply-chain/add-supply-chain.component';

describe('ActiveSupplyChainComponent', () => {
  let component: ActiveSupplyChainComponent;
  let fixture: ComponentFixture<ActiveSupplyChainComponent>;
  let companyProfileService: jasmine.SpyObj<CompanyProfileService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const companyProfileServiceSpy = jasmine.createSpyObj(
      'CompanyProfileService',
      ['getActiveSupplyChains']
    );
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ActiveSupplyChainComponent],
      providers: [
        { provide: CompanyProfileService, useValue: companyProfileServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    companyProfileService = TestBed.inject(
      CompanyProfileService
    ) as jasmine.SpyObj<CompanyProfileService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    // Set up mock return value for getActiveSupplyChains
    companyProfileService.getActiveSupplyChains.and.returnValue(
      of({
        results: [],
        count: 0,
      })
    );

    fixture = TestBed.createComponent(ActiveSupplyChainComponent);
    component = fixture.componentInstance;
    component.companyId = '123'; // Set the input companyId
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('activeSupplychain', () => {
    it('should update dataSource and totalCount on success', () => {
      // Mock the service to return a successful response
      const mockResponse = {
        results: [{ id: 1, name: 'Supply Chain 1' }],
        count: 1,
      };
      companyProfileService.getActiveSupplyChains.and.returnValue(
        of(mockResponse)
      );

      component.activeSupplychain();

      // Assert that the service was called with the expected parameters
      expect(companyProfileService.getActiveSupplyChains).toHaveBeenCalledWith(
        '123',
        0,
        10
      );

      // Check the component properties after success
      expect(component.dataSource).toEqual(mockResponse.results);
      expect(component.totalCount).toBe(mockResponse.count);
      expect(component.loading).toBeFalse();
    });

    it('should handle error and set dataSource to empty array', () => {
      // Mock the service to return an error
      companyProfileService.getActiveSupplyChains.and.returnValue(
        throwError('error')
      );

      component.activeSupplychain();

      // Assert that the service was called with the expected parameters
      expect(companyProfileService.getActiveSupplyChains).toHaveBeenCalledWith(
        '123',
        0,
        10
      );

      // Check the component properties after error
      expect(component.dataSource).toEqual([]);
      expect(component.loading).toBeFalse();
    });
  });

  describe('paginatorEvent', () => {
    it('should update filters and call activeSupplychain', () => {
      // Create a mock data object to simulate the paginator event
      const mockData = {
        limit: 20,
        offset: 40,
      };

      // Spy on the activeSupplychain method to check if it's called
      spyOn(component, 'activeSupplychain');

      // Call paginatorEvent
      component.paginatorEvent(mockData);

      // Check if the filters are updated correctly
      expect(component.filters.limit).toBe(mockData.limit);
      expect(component.filters.offset).toBe(mockData.offset);

      // Ensure the loading state is set to true
      expect(component.loading).toBeTrue();

      // Ensure activeSupplychain was called
      expect(component.activeSupplychain).toHaveBeenCalled();
    });
  });

  describe('addSupplychain', () => {
    it('should open dialog with correct configuration and subscribe to afterClosed', () => {
      // Create a mock dialog reference with the necessary properties and methods
      const mockDialogRef = {
        afterClosed: jasmine.createSpy().and.returnValue(of(true)), // Simulate dialog closing with a truthy result
        close: jasmine.createSpy(), // Add the close method (optional)
      };

      // Mock the dialog to return the mock dialog reference
      matDialog.open.and.returnValue(mockDialogRef as any);

      // Spy on the activeSupplychain method to ensure it's called
      spyOn(component, 'activeSupplychain');

      // Call addSupplychain
      component.addSupplychain();

      // Ensure dialog.open was called with the correct configuration
      expect(matDialog.open).toHaveBeenCalledWith(AddSupplyChainComponent, {
        width: '50vw',
        height: 'auto',
        panelClass: 'custom-modalbox',
        data: { id: '123' },
      });

      // Check that afterClosed() was subscribed to
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      // Simulate the dialog closing with a result and check if activeSupplychain is called
      mockDialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          expect(component.loading).toBeTrue();
          expect(component.activeSupplychain).toHaveBeenCalled();
        }
      });

      // Since the result is truthy, it should set loading to true and call activeSupplychain
      expect(component.loading).toBeTrue();
      expect(component.activeSupplychain).toHaveBeenCalled();
    });

    it('should not call activeSupplychain if result is falsy', () => {
      // Create a mock dialog reference with the necessary properties and methods
      const mockDialogRef = {
        afterClosed: jasmine.createSpy().and.returnValue(of(false)), // Simulate dialog closing with a falsy result
        close: jasmine.createSpy(), // Add the close method (optional)
      };

      // Mock the dialog to return the mock dialog reference
      matDialog.open.and.returnValue(mockDialogRef as any);

      // Spy on the activeSupplychain method to ensure it's not called
      spyOn(component, 'activeSupplychain');

      // Call addSupplychain
      component.addSupplychain();

      // Ensure dialog.open was called with the correct configuration
      expect(matDialog.open).toHaveBeenCalledWith(AddSupplyChainComponent, {
        width: '50vw',
        height: 'auto',
        panelClass: 'custom-modalbox',
        data: { id: '123' },
      });

      // Check that afterClosed() was subscribed to
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      // Since the result is falsy, activeSupplychain should not be called
      expect(component.activeSupplychain).not.toHaveBeenCalled();
    });
  });
});
