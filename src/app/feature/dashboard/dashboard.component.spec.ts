import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { FeatureService } from '../feature.service';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { nFormatter } from 'src/app/shared/configs/app.config';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let featureServiceMock: jasmine.SpyObj<FeatureService>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    featureServiceMock = jasmine.createSpyObj('FeatureService', [
      'statisticsData',
      'getFarmersList',
      'getCompanyList',
      'getTransactionList',
    ]);

    // Mock BehaviorSubject directly for supplyChainDataChanged
    const supplyChainDataChangedMock = new BehaviorSubject({
      type: 'supplyChain',
      value: 'chain1',
    });

    // Mock DataService
    dataServiceMock = jasmine.createSpyObj('DataService', ['hideSupplyChain']);
    dataServiceMock.supplyChainDataChanged = supplyChainDataChangedMock; // Directly assign the BehaviorSubject
    dataServiceMock.hideSupplyChain = jasmine.createSpyObj('hideSupplyChain', [
      'next',
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        TranslateModule.forRoot(), // Add TranslateModule to imports
      ],
      providers: [
        { provide: FeatureService, useValue: featureServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors for minimal test
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call viewDetails with correct URL', () => {
    const id = '123';
    component.viewDetails(id);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
      '/company-profile/' + id
    );
  });

  it('should call viewFarmerDetails with correct URL', () => {
    const id = '456';
    component.viewFarmerDetails(id);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
      '/farmer-profile/' + id
    );
  });

  it('should unsubscribe from API calls on ngOnDestroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.pageApis = [subscriptionSpy];

    component.ngOnDestroy();

    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should initialize API calls on ngOnInit and subscribe to supplyChainDataChanged', () => {
    // Since the BehaviorSubject is already initialized, we don’t need to do anything here.

    // Spy on initApiCalls to check if it is called
    spyOn(component, 'initApiCalls');

    // Call ngOnInit manually
    component.ngOnInit();

    // Assertions
    expect(component.selectedChain).toBe('chain1'); // Ensure selectedChain is updated
    expect(component.initApiCalls).toHaveBeenCalled(); // Verify initApiCalls is called
    expect(dataServiceMock.hideSupplyChain.next).toHaveBeenCalledWith('show'); // Check if hideSupplyChain was triggered
  });

  it('should call homeStatistics and recentFarmers in initApiCalls and set loaderValue', () => {
    // Spy on homeStatistics and recentFarmers methods to check if they are called
    spyOn(component, 'homeStatistics');
    spyOn(component, 'recentFarmers');

    // Call initApiCalls manually
    component.initApiCalls();

    // Verify that homeStatistics and recentFarmers are called
    expect(component.homeStatistics).toHaveBeenCalled();
    expect(component.recentFarmers).toHaveBeenCalled();

    // Verify loaderValue is set to 1
    expect(component.loaderValue).toBe(1);
  });

  it('should call statisticsData and update statisticsData on success', () => {
    // Mock the result of the API call
    const mockStatisticsResponse = {
      actors: 10,
      companies: 5,
      farmer_transaction_quantity: 100,
      products: 50,
      supply_chains: 10,
      transactions: 20,
      farmers: 30,
    };

    // Set up the spy for statisticsData to return the mock response
    featureServiceMock.statisticsData.and.returnValue(
      of(mockStatisticsResponse)
    );

    // Call homeStatistics method
    component.homeStatistics();

    // Verify that the statisticsData method was called with the selectedChain
    expect(featureServiceMock.statisticsData).toHaveBeenCalledWith(
      component.selectedChain
    );

    // Wait for the result to be processed and verify the statisticsData is correctly set
    expect(component.statisticsData).toEqual({
      actors: {
        title: mockStatisticsResponse.actors,
        value: nFormatter(mockStatisticsResponse.actors),
      },
      companies: {
        title: mockStatisticsResponse.companies,
        value: nFormatter(mockStatisticsResponse.companies),
      },
      totalQuantity: {
        title: Math.floor(mockStatisticsResponse.farmer_transaction_quantity),
        value: nFormatter(
          Math.floor(mockStatisticsResponse.farmer_transaction_quantity)
        ),
      },
      products: {
        title: mockStatisticsResponse.products,
        value: nFormatter(mockStatisticsResponse.products),
      },
      supplyChains: {
        title: mockStatisticsResponse.supply_chains,
        value: nFormatter(mockStatisticsResponse.supply_chains),
      },
      transactions: {
        title: mockStatisticsResponse.transactions,
        value: nFormatter(mockStatisticsResponse.transactions),
      },
      farmers: {
        title: mockStatisticsResponse.farmers,
        value: nFormatter(mockStatisticsResponse.farmers),
      },
    });
  });

  it('should set statisticsData to null on error', () => {
    // Set up the spy for statisticsData to return an error
    featureServiceMock.statisticsData.and.returnValue(throwError('Error'));

    // Call homeStatistics method
    component.homeStatistics();

    // Verify that statisticsData is set to null after error
    expect(component.statisticsData).toBeNull();
  });

  it('should call getFarmersList, update recentlyAddedFarmers and loaderValue, and call recentCompanies on success', () => {
    // Mock response for getFarmersList
    const mockFarmersListResponse = {
      results: [
        { id: 1, name: 'Farmer 1' },
        { id: 2, name: 'Farmer 2' },
      ],
    };

    // Set up the spy for getFarmersList to return the mock response
    featureServiceMock.getFarmersList.and.returnValue(
      of(mockFarmersListResponse)
    );

    // Spy on recentCompanies method to check if it's called
    spyOn(component, 'recentCompanies');

    // Call recentFarmers method
    component.recentFarmers();

    // Verify that getFarmersList was called with the correct parameters
    expect(featureServiceMock.getFarmersList).toHaveBeenCalledWith({
      selectedSupplyChain: '',
      limit: 5,
      offset: 0,
      searchString: '',
      selectedCountry: '',
      sortBy: 'created_on',
      orderBy: 'desc',
    });

    // Verify that recentlyAddedFarmers is updated with the mock results
    expect(component.recentlyAddedFarmers).toEqual(
      mockFarmersListResponse.results
    );

    // Verify loaderValue is set to 2
    expect(component.loaderValue).toBe(2);

    // Verify that recentCompanies was called
    expect(component.recentCompanies).toHaveBeenCalled();
  });

  it('should handle error in getFarmersList, set recentlyAddedFarmers to empty array, set loaderValue to 2, and call recentCompanies', () => {
    // Set up the spy for getFarmersList to return an error
    featureServiceMock.getFarmersList.and.returnValue(throwError('Error'));

    // Spy on recentCompanies method to check if it's called
    spyOn(component, 'recentCompanies');

    // Call recentFarmers method
    component.recentFarmers();

    // Verify that getFarmersList was called
    expect(featureServiceMock.getFarmersList).toHaveBeenCalled();

    // Verify that recentlyAddedFarmers is set to an empty array
    expect(component.recentlyAddedFarmers).toEqual([]);

    // Verify loaderValue is set to 2
    expect(component.loaderValue).toBe(2);

    // Verify that recentCompanies was called
    expect(component.recentCompanies).toHaveBeenCalled();
  });

  it('should call getCompanyList, update recentlyAddedCompanies and loaderValue, and call transactionList on success', () => {
    // Mock response for getCompanyList
    const mockCompanyListResponse = {
      results: [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' },
      ],
    };

    // Set up the spy for getCompanyList to return the mock response
    featureServiceMock.getCompanyList.and.returnValue(
      of(mockCompanyListResponse)
    );

    // Spy on transactionList method to check if it's called
    spyOn(component, 'transactionList');

    // Call recentCompanies method
    component.recentCompanies();

    // Verify that getCompanyList was called with the correct parameters
    expect(featureServiceMock.getCompanyList).toHaveBeenCalledWith({
      selectedSupplyChain: '',
      limit: 5,
      offset: 0,
      searchString: '',
      status: '',
      selectedCountry: '',
      sortBy: 'created_on',
      orderBy: 'desc',
    });

    // Verify that recentlyAddedCompanies is updated with the mock results
    expect(component.recentlyAddedCompanies).toEqual(
      mockCompanyListResponse.results
    );

    // Verify loaderValue is set to 3
    expect(component.loaderValue).toBe(3);

    // Verify that transactionList was called
    expect(component.transactionList).toHaveBeenCalled();
  });

  it('should handle error in getCompanyList, set recentlyAddedCompanies to empty array, set loaderValue to 3, and call transactionList', () => {
    // Set up the spy for getCompanyList to return an error
    featureServiceMock.getCompanyList.and.returnValue(throwError('Error'));

    // Spy on transactionList method to check if it's called
    spyOn(component, 'transactionList');

    // Call recentCompanies method
    component.recentCompanies();

    // Verify that getCompanyList was called
    expect(featureServiceMock.getCompanyList).toHaveBeenCalled();

    // Verify that recentlyAddedCompanies is set to an empty array
    expect(component.recentlyAddedCompanies).toEqual([]);

    // Verify loaderValue is set to 3
    expect(component.loaderValue).toBe(3);

    // Verify that transactionList was called
    expect(component.transactionList).toHaveBeenCalled();
  });

  it('should call getTransactionList, update recentTransactions and loaderValue on success', () => {
    // Mock response for getTransactionList
    const mockTransactionListResponse = {
      results: [
        { id: 1, transactionDate: '2025-01-01' },
        { id: 2, transactionDate: '2025-01-02' },
      ],
    };

    // Set up the spy for getTransactionList to return the mock response
    featureServiceMock.getTransactionList.and.returnValue(
      of(mockTransactionListResponse)
    );

    // Call transactionList method
    component.transactionList();

    // Verify that getTransactionList was called with the correct parameters
    expect(featureServiceMock.getTransactionList).toHaveBeenCalledWith({
      limit: 5,
      offset: 0,
      searchString: '',
      selectedSupplyChain: '',
      sortBy: 'date',
      orderBy: 'desc',
    });

    // Verify that recentTransactions is updated with the mock results
    expect(component.recentTransactions).toEqual(
      mockTransactionListResponse.results
    );

    // Verify loaderValue is set to 4
    expect(component.loaderValue).toBe(4);
  });

  it('should handle error in getTransactionList, set recentTransactions to empty array, and set loaderValue to 4', () => {
    // Set up the spy for getTransactionList to return an error
    featureServiceMock.getTransactionList.and.returnValue(throwError('Error'));

    // Call transactionList method
    component.transactionList();

    // Verify that getTransactionList was called
    expect(featureServiceMock.getTransactionList).toHaveBeenCalled();

    // Verify that recentTransactions is set to an empty array
    expect(component.recentTransactions).toEqual([]);

    // Verify loaderValue is set to 4
    expect(component.loaderValue).toBe(4);
  });
});
