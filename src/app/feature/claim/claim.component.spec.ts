import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClaimComponent } from './claim.component';
import { DataService } from 'src/app/shared/services/data.service';
import { ClaimService } from './claim.service';
import { ACTION_TYPE } from 'fairfood-utils';

describe('ClaimComponent', () => {
  let component: ClaimComponent;
  let fixture: ComponentFixture<ClaimComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockClaimService: jasmine.SpyObj<ClaimService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'fetchAllSupplyChains',
      'customSnackBar',
    ]);
    mockDataService.hideSupplyChain = {
      next: jasmine.createSpy('next'),
    } as any;
    mockClaimService = jasmine.createSpyObj('ClaimService', [
      'getClaimsList',
      'updateClaim',
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ClaimComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ClaimService, useValue: mockClaimService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimComponent);
    component = fixture.componentInstance;

    mockDataService.fetchAllSupplyChains.and.returnValue(of([]));
    mockClaimService.getClaimsList.and.returnValue(
      of({ results: [], count: 0 })
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call hideSupplyChain.next, set loading to true, and call getSupplyChains on ngOnInit', () => {
    const spyGetSupplyChains = spyOn(component, 'getSupplyChains');

    component.ngOnInit();

    expect(mockDataService.hideSupplyChain.next).toHaveBeenCalledWith('hide');
    expect(component.loading).toBeTrue();
    expect(spyGetSupplyChains).toHaveBeenCalled();
  });

  it('should fetch supply chains, update supplyChainList, call loadClaims, and add subscription to pageApis', () => {
    const mockResponse = [{ id: 1, name: 'Supply Chain 1' }];
    mockDataService.fetchAllSupplyChains.and.returnValue(of(mockResponse));
    const spyLoadClaims = spyOn(component, 'loadClaims');

    component.getSupplyChains();

    // Verify fetchAllSupplyChains is called with an empty string
    expect(mockDataService.fetchAllSupplyChains).toHaveBeenCalledWith('');
    // Verify supplyChainList is updated with the response
    expect(component.supplyChainList).toEqual(mockResponse);
    // Verify loadClaims is called
    expect(spyLoadClaims).toHaveBeenCalled();
    // Verify the subscription is added to pageApis
    expect(component.pageApis.length).toBe(1);
  });

  it('should set loading to true and call claimList', () => {
    const spyClaimList = spyOn(component, 'claimList');

    component.loadClaims();

    // Verify that the loading property is set to true
    expect(component.loading).toBeTrue();
    // Verify that claimList is called
    expect(spyClaimList).toHaveBeenCalled();
  });

  it('should fetch claims, update totalCount and dataSource, and handle loading state correctly', fakeAsync(() => {
    const mockResponse = {
      results: [
        { id: 1, name: 'Claim 1', supply_chains: [{ name: 'Supply A' }] },
        { id: 2, name: 'Claim 2', supply_chains: [{ name: 'Supply B' }] },
      ],
      count: 2,
    };
    mockClaimService.getClaimsList.and.returnValue(of(mockResponse));

    component.claimList();

    // Simulate the asynchronous operation
    tick();

    // Verify that getClaimsList is called with appliedFilters
    expect(mockClaimService.getClaimsList).toHaveBeenCalledWith(
      component.appliedFilters
    );
    // Verify totalCount and dataSource are updated correctly
    expect(component.totalCount).toBe(mockResponse.count);
    expect(component.dataSource).toEqual([
      {
        id: 1,
        name: 'Claim 1',
        supply_chains: [{ name: 'Supply A' }],
        supplyNames: ['Supply A'],
      },
      {
        id: 2,
        name: 'Claim 2',
        supply_chains: [{ name: 'Supply B' }],
        supplyNames: ['Supply B'],
      },
    ]);
    // Verify that loading is set to false after success
    expect(component.loading).toBeFalse();
    // Verify the subscription is added to pageApis
    expect(component.pageApis.length).toBe(1);
  }));

  it('should handle API error by clearing dataSource and setting loading to false', fakeAsync(() => {
    // Simulate an error response from the service
    mockClaimService.getClaimsList.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.claimList();

    // Simulate the asynchronous operation
    tick();

    // Verify that dataSource is cleared on error
    expect(component.dataSource).toEqual([]);
    // Verify that loading is set to false on error
    expect(component.loading).toBeFalse();
    // Verify the subscription is added to pageApis
    expect(component.pageApis.length).toBe(1);
  }));

  it('should update appliedFilters with limit and offset and call loadClaims', () => {
    const mockData = { limit: 20, offset: 40 };
    const spyLoadClaims = spyOn(component, 'loadClaims');

    component.paginatorEvent(mockData);

    // Verify that appliedFilters.limit and appliedFilters.offset are updated
    expect(component.appliedFilters.limit).toBe(mockData.limit);
    expect(component.appliedFilters.offset).toBe(mockData.offset);
    // Verify that loadClaims is called
    expect(spyLoadClaims).toHaveBeenCalled();
  });

  it('should update appliedFilters.searchString and call resetFilter', () => {
    const mockSearchString = 'search term';
    const spyResetFilter = spyOn(component, 'resetFilter');

    component.searchFilter(mockSearchString);

    // Verify that appliedFilters.searchString is updated
    expect(component.appliedFilters.searchString).toBe(mockSearchString);
    // Verify that resetFilter is called
    expect(spyResetFilter).toHaveBeenCalled();
  });

  it('should toggle create flag, reset appliedFilters, and call loadClaims', () => {
    const spyLoadClaims = spyOn(component, 'loadClaims');

    // Set initial state for testing
    component.create = false;
    component.appliedFilters = {
      status: 'active',
      limit: 20,
      offset: 20,
      searchString: 'test',
      type: 'claimType',
      selectedSupplyChain: 'supplyChain1',
    };

    component.toggleCreateClaim();

    // Verify that create flag is toggled
    expect(component.create).toBeTrue();
    // Verify that appliedFilters is reset to initial state
    expect(component.appliedFilters).toEqual({
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
      selectedSupplyChain: '',
    });
    // Verify that loadClaims is called
    expect(spyLoadClaims).toHaveBeenCalled();
  });

  it('should reset appliedFilters.limit and appliedFilters.offset and call loadClaims', () => {
    const spyLoadClaims = spyOn(component, 'loadClaims');

    // Set initial state for testing
    component.appliedFilters = {
      status: 'active',
      limit: 20,
      offset: 30,
      searchString: 'search term',
      type: 'claimType',
      selectedSupplyChain: 'supplyChain1',
    };

    component.resetFilter();

    // Verify that appliedFilters.limit is reset to 10
    expect(component.appliedFilters.limit).toBe(10);
    // Verify that appliedFilters.offset is reset to 0
    expect(component.appliedFilters.offset).toBe(0);
    // Verify that loadClaims is called
    expect(spyLoadClaims).toHaveBeenCalled();
  });

  it('should toggle toggleFilter, reset appliedFilters, and call loadClaims when toggleFilter is false', () => {
    const spyLoadClaims = spyOn(component, 'loadClaims');

    // Set initial state for testing
    component.toggleFilter = true; // Initially, set toggleFilter to true
    component.appliedFilters = {
      status: 'active',
      limit: 20,
      offset: 20,
      searchString: 'search term',
      type: 'claimType',
      selectedSupplyChain: 'supplyChain1',
    };

    component.filterClicked(); // Call the method

    // Verify that toggleFilter is toggled (true to false)
    expect(component.toggleFilter).toBeFalse();
    // Verify that appliedFilters is reset to initial state
    expect(component.appliedFilters).toEqual({
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
      selectedSupplyChain: '',
    });
    // Verify that loadClaims is called
    expect(spyLoadClaims).toHaveBeenCalled();
  });

  it('should toggle toggleFilter without resetting appliedFilters and not call loadClaims when toggleFilter is true', () => {
    const spyLoadClaims = spyOn(component, 'loadClaims');

    // Set initial state for testing
    component.toggleFilter = false; // Initially, set toggleFilter to false
    const initialAppliedFilters = {
      status: 'active',
      limit: 20,
      offset: 20,
      searchString: 'search term',
      type: 'claimType',
      selectedSupplyChain: 'supplyChain1',
    };
    component.appliedFilters = { ...initialAppliedFilters };

    component.filterClicked(); // Call the method

    // Verify that toggleFilter is toggled (false to true)
    expect(component.toggleFilter).toBeTrue();
    // Verify that appliedFilters remains unchanged
    expect(component.appliedFilters).toEqual(initialAppliedFilters); // Ensure values are the same, even though the objects are different
    // Verify that loadClaims is not called
    expect(spyLoadClaims).not.toHaveBeenCalled();
  });

  it('should update appliedFilters based on type and data.id and call resetFilter', () => {
    const spyResetFilter = spyOn(component, 'resetFilter');

    // Test data
    const dataStatus = { id: 'active' };
    const dataSupply = { id: 'supplyChain1' };
    const dataType = { id: 'claimType' };
    const dataAll = { id: 'All' }; // Testing 'All' case

    // Initial appliedFilters state
    component.appliedFilters = {
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
      selectedSupplyChain: '',
    };

    // Call with status filter type
    component.otherFilters(dataStatus, 'status');
    expect(component.appliedFilters.status).toBe('active');

    // Call with supply filter type
    component.otherFilters(dataSupply, 'supply');
    expect(component.appliedFilters.selectedSupplyChain).toBe('supplyChain1');

    // Call with type filter type
    component.otherFilters(dataType, 'type');
    expect(component.appliedFilters.type).toBe('claimType');

    // Test 'All' case where filter should reset to empty string
    component.otherFilters(dataAll, 'status');
    expect(component.appliedFilters.status).toBe('');

    // Verify that resetFilter is called after each update
    expect(spyResetFilter).toHaveBeenCalledTimes(4); // Called 4 times for each filter update
  });
});
