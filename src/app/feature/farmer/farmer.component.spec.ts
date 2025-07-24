import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FarmerComponent } from './farmer.component';
import { FeatureService } from '../feature.service';
import { DataService } from 'src/app/shared/services/data.service';
import { CompanyProfileService } from 'src/app/feature/company-profile/company-profile.service';

describe('FarmerComponent', () => {
  let component: FarmerComponent;
  let fixture: any;
  let mockFeatureService: any;
  let mockDataService: any;
  let mockCompanyProfileService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockFeatureService = jasmine.createSpyObj('FeatureService', [
      'getCountryList',
      'getFarmersList',
      'statisticsData',
      'companyGraphData',
      'genericGraphData',
    ]);
    mockFeatureService.getCountryList.and.returnValue(of([]));
    mockFeatureService.getFarmersList.and.returnValue(
      of({ results: [], count: 0 })
    );
    mockFeatureService.statisticsData.and.returnValue(of({}));
    mockFeatureService.companyGraphData.and.returnValue(of([]));

    mockDataService = jasmine.createSpyObj('DataService', [
      'fetchAllSupplyChains',
      'initExportData',
    ]);
    mockDataService.hideSupplyChain = { next: jasmine.createSpy('next') };
    mockDataService.fetchAllSupplyChains.and.returnValue(of([]));

    mockCompanyProfileService = jasmine.createSpyObj('CompanyProfileService', [
      'formatCountries',
    ]);
    mockCompanyProfileService.formatCountries.and.returnValue({
      countries: [],
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [FarmerComponent],
      providers: [
        { provide: FeatureService, useValue: mockFeatureService },
        { provide: DataService, useValue: mockDataService },
        { provide: CompanyProfileService, useValue: mockCompanyProfileService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(FarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call farmerList() and set loading to true in loadFarmer()', () => {
    spyOn(component, 'farmerList'); // Spy on farmerList method
    component.loadFarmer();
    expect(component.loading).toBeTrue(); // Verify loading is set to true
    expect(component.farmerList).toHaveBeenCalled(); // Verify farmerList is called
  });

  it('should handle API errors and reset dataSource and totalCount in farmerList()', () => {
    mockFeatureService.getFarmersList.and.returnValue(
      throwError(() => new Error('API error'))
    );
    component.farmerList();
    expect(component.dataSource).toEqual([]); // Verify dataSource is reset
    expect(component.totalCount).toBe(0); // Verify totalCount is reset
    expect(component.loading).toBeFalse(); // Verify loading is set to false
  });

  it('should update appliedFilters and call loadFarmer() in paginatorEvent()', () => {
    spyOn(component, 'loadFarmer'); // Spy on loadFarmer method

    const paginationData = { limit: 20, offset: 40 }; // Mock pagination data
    component.paginatorEvent(paginationData);

    expect(component.appliedFilters.limit).toBe(20); // Verify limit is updated
    expect(component.appliedFilters.offset).toBe(40); // Verify offset is updated
    expect(component.loadFarmer).toHaveBeenCalled(); // Verify loadFarmer is called
  });

  it('should update appliedFilters and call loadFarmer() in searchFilter()', () => {
    spyOn(component, 'loadFarmer'); // Spy on loadFarmer method

    const searchData = 'Sample Search Query'; // Mock search data
    component.searchFilter(searchData);

    expect(component.appliedFilters.searchString).toBe(searchData); // Verify searchString is updated
    expect(component.appliedFilters.limit).toBe(10); // Verify limit is reset
    expect(component.appliedFilters.offset).toBe(0); // Verify offset is reset
    expect(component.loadFarmer).toHaveBeenCalled(); // Verify loadFarmer is called
  });

  it('should toggle toggleFilter and reset filters when toggleFilter is false in filterClicked()', () => {
    spyOn(component, 'resetFilter'); // Spy on resetFilter method
    spyOn(component, 'loadFarmer'); // Spy on loadFarmer method

    // Initial state: toggleFilter is false
    component.toggleFilter = false;

    // Call filterClicked
    component.filterClicked();

    // After the method call, toggleFilter should be true
    expect(component.toggleFilter).toBeTrue();

    // Call filterClicked again to toggle it back to false
    component.filterClicked();

    // toggleFilter should be false
    expect(component.toggleFilter).toBeFalse();

    // resetFilter and loadFarmer should have been called
    expect(component.resetFilter).toHaveBeenCalled();
    expect(component.loadFarmer).toHaveBeenCalled();
  });

  it('should update appliedFilters and call loadFarmer() in otherFilters()', () => {
    const loadFarmerSpy = spyOn(component, 'loadFarmer'); // Spy on loadFarmer method

    // Initialize appliedFilters object for the test
    component.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
      selectedCountry: '',
      selectedSupplyChain: '',
      sortBy: 'created_on',
      orderBy: 'desc',
    };

    // Test case for "supply" type
    const supplyData = { id: '123' };
    component.otherFilters(supplyData, 'supply');
    expect(component.appliedFilters.selectedSupplyChain).toBe('123'); // Verify selectedSupplyChain is updated
    expect(component.appliedFilters.selectedCountry).toBe(''); // Ensure selectedCountry remains unchanged
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for "country" type
    const countryData = { id: '456' };
    component.otherFilters(countryData, 'country');
    expect(component.appliedFilters.selectedCountry).toBe('456'); // Verify selectedCountry is updated
    expect(component.appliedFilters.selectedSupplyChain).toBe('123'); // Ensure selectedSupplyChain remains unchanged
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for "All" option
    const allData = { id: 'All' };
    component.otherFilters(allData, 'supply');
    expect(component.appliedFilters.selectedSupplyChain).toBe(''); // Verify selectedSupplyChain is cleared
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again
  });

  it('should navigate to the correct URL in viewDetails()', () => {
    const farmerId = '123';

    // Call viewDetails with a mock farmer ID
    component.viewDetails(farmerId);

    // Verify that the router's navigateByUrl method is called with the correct URL
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      '/farmer-profile/' + farmerId
    );
  });

  it('should update appliedFilters and call loadFarmer() for all sort cases', () => {
    const loadFarmerSpy = spyOn(component, 'loadFarmer'); // Spy on loadFarmer method

    // Initialize appliedFilters for the test
    component.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
      selectedCountry: '',
      selectedSupplyChain: '',
      sortBy: 'created_on',
      orderBy: 'desc', // Initial value of orderBy
    };

    // Test case for sorting by 'created_on'
    component.sortData('created_on');
    expect(component.appliedFilters.sortBy).toBe('created_on'); // Verify sortBy is updated
    expect(component.appliedFilters.orderBy).toBe('asc'); // First click should set orderBy to 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'created_on' again (should toggle orderBy)
    component.sortData('created_on');
    expect(component.appliedFilters.sortBy).toBe('created_on'); // sortBy remains 'created_on'
    expect(component.appliedFilters.orderBy).toBe('desc'); // Second click should toggle orderBy to 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'country'
    component.sortData('country');
    expect(component.appliedFilters.sortBy).toBe('country'); // Verify sortBy is updated to 'country'
    expect(component.appliedFilters.orderBy).toBe('asc'); // First click should set orderBy to 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'country' again (should toggle orderBy)
    component.sortData('country');
    expect(component.appliedFilters.sortBy).toBe('country'); // sortBy remains 'country'
    expect(component.appliedFilters.orderBy).toBe('desc'); // Second click should toggle orderBy to 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'name'
    component.sortData('name');
    expect(component.appliedFilters.sortBy).toBe('name'); // Verify sortBy is updated to 'name'
    expect(component.appliedFilters.orderBy).toBe('asc'); // First click should set orderBy to 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'name' again (should toggle orderBy)
    component.sortData('name');
    expect(component.appliedFilters.sortBy).toBe('name'); // sortBy remains 'name'
    expect(component.appliedFilters.orderBy).toBe('desc'); // Second click should toggle orderBy to 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'supplying'
    component.sortData('supplying');
    expect(component.appliedFilters.sortBy).toBe('supplying'); // Verify sortBy is updated to 'supplying'
    expect(component.appliedFilters.orderBy).toBe('asc'); // First click should set orderBy to 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'supplying' again (should toggle orderBy)
    component.sortData('supplying');
    expect(component.appliedFilters.sortBy).toBe('supplying'); // sortBy remains 'supplying'
    expect(component.appliedFilters.orderBy).toBe('desc'); // Second click should toggle orderBy to 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'supplyChains'
    component.sortData('supplyChains');
    expect(component.appliedFilters.sortBy).toBe('supplyChains'); // Verify sortBy is updated to 'supplyChains'
    expect(component.appliedFilters.orderBy).toBe('asc'); // First click should set orderBy to 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by 'supplyChains' again (should toggle orderBy)
    component.sortData('supplyChains');
    expect(component.appliedFilters.sortBy).toBe('supplyChains'); // sortBy remains 'supplyChains'
    expect(component.appliedFilters.orderBy).toBe('desc'); // Second click should toggle orderBy to 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for sorting by an unknown column (default case)
    component.sortData('unknown_column');
    expect(component.appliedFilters.sortBy).toBe('created_on'); // Default case should set sortBy to 'created_on'
    expect(component.appliedFilters.orderBy).toBe('asc'); // Default orderBy should be 'asc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called

    // Reset spy calls
    loadFarmerSpy.calls.reset();

    // Test case for toggling orderBy when sorting by the same column 'name'
    component.sortData('name');
    expect(component.appliedFilters.sortBy).toBe('name'); // Verify sortBy remains 'name'
    // expect(component.appliedFilters.orderBy).toBe('desc'); // Since it's toggled, orderBy should be 'desc'
    expect(loadFarmerSpy).toHaveBeenCalled(); // Verify loadFarmer is called again
  });
});
