import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { DashboardService } from '../dashboard.service';
import { LineGraphDashboardComponent } from './line-graph-dashboard.component';
import { YearObj } from '../dashboard.config';
import { HeaderFilter } from 'src/app/shared/configs/app.constants';

describe('LineGraphDashboardComponent', () => {
  let component: LineGraphDashboardComponent;
  let fixture: ComponentFixture<LineGraphDashboardComponent>;
  let dashboardServiceMock: jasmine.SpyObj<DashboardService>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let supplyChainSubject: BehaviorSubject<any>;

  beforeEach(() => {
    supplyChainSubject = new BehaviorSubject<any>(null); // Initialize with BehaviorSubject

    dataServiceMock = jasmine.createSpyObj('DataService', [], {
      supplyChainDataChanged: supplyChainSubject, // Mock the observable properly
    });

    dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
      'actorReportData',
      'actorTransactionReportData',
      'farmerQuantityReportData',
      'formatActorsGraphData',
      'formatTransactionData',
    ]);

    TestBed.configureTestingModule({
      declarations: [LineGraphDashboardComponent],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineGraphDashboardComponent);
    component = fixture.componentInstance;

    // Access the private dataService through TestBed.inject
    dataServiceMock = TestBed.inject(
      DataService
    ) as jasmine.SpyObj<DataService>;

    // Mock service methods to return observables
    dashboardServiceMock.actorReportData.and.returnValue(of([]));
    dashboardServiceMock.actorTransactionReportData.and.returnValue(of([]));
    dashboardServiceMock.farmerQuantityReportData.and.returnValue(of([]));

    fixture.detectChanges(); // Trigger component lifecycle hooks
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and make API calls on init', () => {
    const initApiCallsSpy = spyOn(component, 'initApiCalls');
    component.ngOnInit();
    expect(initApiCallsSpy).toHaveBeenCalled();
  });

  it('should subscribe to supplyChainDataChanged and trigger appropriate logic on emit', () => {
    // Arrange: Mock necessary values and methods
    const mockHeaderFilterSupplyChain: HeaderFilter = {
      type: 'supplyChain',
      value: 'mockSupplyChain',
    };
    spyOn(component, 'initApiCalls');
    spyOn(component, 'actorReportData');
    spyOn(component, 'getfarmerTransactionData');
    spyOn(component, 'farmerTransactionQuantityData');

    // Emit a value from the observable to trigger the logic
    dataServiceMock.supplyChainDataChanged.next(mockHeaderFilterSupplyChain);

    // Act: Call ngOnInit to trigger the subscription logic
    component.ngOnInit();

    // Assert: Check if the appropriate methods are called based on the emitted value
    expect(component.selectedSupplyChain).toBe('mockSupplyChain');
    expect(component.initApiCalls).toHaveBeenCalled();

    // Since the emitted type is 'supplyChain', `getfarmerTransactionData` should NOT be called.
    expect(component.getfarmerTransactionData).not.toHaveBeenCalled();
    expect(component.farmerTransactionQuantityData).not.toHaveBeenCalled();

    // Now test with a 'commodity' type emission (expect actorReportData to be called)
    const mockHeaderFilterCommodity: HeaderFilter = {
      type: 'commodity',
      value: 'mockCommodity',
    };
    dataServiceMock.supplyChainDataChanged.next(mockHeaderFilterCommodity);

    // Check if actorReportData is called when the type is 'commodity'
    expect(component.actorReportData).toHaveBeenCalled();

    // Ensure neither getfarmerTransactionData nor farmerTransactionQuantityData is called
    expect(component.farmerTransactionQuantityData).not.toHaveBeenCalled();

    // Now test with a 'year' type emission, which should trigger getfarmerTransactionData
    const mockYearObj: YearObj = {
      name: '2025',
      id: '2025-id',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    };

    const mockHeaderFilterYear: HeaderFilter = {
      type: 'year',
      value: mockYearObj,
    };
    dataServiceMock.supplyChainDataChanged.next(mockHeaderFilterYear);

    // Check if actorReportData is called with the year filter as a YearObj
    expect(component.actorReportData).toHaveBeenCalledWith(mockYearObj);

    // Since it's a 'year' type, getfarmerTransactionData should now be called (but only if the innerFilter is 'Transactions')
    if (component.farmerFilters.innerFilter === 'Transactions') {
      expect(component.getfarmerTransactionData).toHaveBeenCalled();
    } else {
      expect(component.getfarmerTransactionData).not.toHaveBeenCalled();
    }
  });

  it('should call actorReportData with the correct parameters', () => {
    const mockYearObj: YearObj = {
      name: '2023',
      id: '1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    dashboardServiceMock.actorReportData.and.returnValue(of([]));

    component.actorReportData(mockYearObj, false);

    expect(dashboardServiceMock.actorReportData).toHaveBeenCalledWith(
      'month',
      mockYearObj.startDate,
      mockYearObj.endDate,
      '',
      ''
    );
  });

  it('should reset filters on initApiCalls', () => {
    component.actorFilters = {
      currentProduct: 'Old',
      currentYearFilter: null,
      currentActorType: null,
      actorTypes: [],
    };
    component.farmerFilters = {
      currentProduct: 'Old',
      currentYearFilter: null,
      innerFilter: null,
      filterItems: [],
    };
    component.initApiCalls();
    expect(component.actorFilters.currentProduct).toEqual('');
    expect(component.actorFilters.currentYearFilter).toBeTruthy();
    expect(component.farmerFilters.currentProduct).toEqual('');
    expect(component.farmerFilters.currentYearFilter).toBeTruthy();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component.pageApis[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle supply chain changes', () => {
    const mockFilter = { type: 'supplyChain', value: 'testChain' };
    const initApiCallsSpy = spyOn(component, 'initApiCalls');
    supplyChainSubject.next(mockFilter);
    expect(component.selectedSupplyChain).toEqual(mockFilter.value);
    expect(initApiCallsSpy).toHaveBeenCalled();
  });

  it('should update actorFilters and call actorReportData when type is "actor"', () => {
    // Arrange: Mock input and method calls
    const mockYearObj: YearObj = {
      name: '2023',
      id: '1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    spyOn(component, 'actorReportData');

    // Act: Call the method with type "actor"
    component.yearFilterCommon('actor', mockYearObj);

    // Assert: Verify actorFilters and method call
    expect(component.actorFilters.currentYearFilter).toEqual(mockYearObj);
    expect(component.actorReportData).toHaveBeenCalledWith(mockYearObj);
  });

  it('should update farmerFilters and call getfarmerTransactionData when type is not "actor" and innerFilter is "Transactions"', () => {
    // Arrange: Mock input and method calls
    const mockYearObj: YearObj = {
      name: '2023',
      id: '1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };
    component.farmerFilters = {
      currentYearFilter: null,
      currentProduct: '',
      innerFilter: 'Transactions',
      filterItems: ['Transactions', 'Quantity'],
    };

    spyOn(component, 'getfarmerTransactionData');

    // Act: Call the method with type not "actor"
    component.yearFilterCommon('farmer', mockYearObj);

    // Assert: Verify farmerFilters and method call
    expect(component.farmerFilters.currentYearFilter).toEqual(mockYearObj);
    expect(component.getfarmerTransactionData).toHaveBeenCalled();
  });

  it('should update farmerFilters and call farmerTransactionQuantityData when type is not "actor" and innerFilter is not "Transactions"', () => {
    // Arrange: Mock input and method calls
    const mockYearObj: YearObj = {
      name: '2023',
      id: '1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };
    component.farmerFilters = {
      currentYearFilter: null,
      currentProduct: '',
      innerFilter: 'Quantity',
      filterItems: ['Transactions', 'Quantity'],
    };

    spyOn(component, 'farmerTransactionQuantityData');

    // Act: Call the method with type not "actor"
    component.yearFilterCommon('farmer', mockYearObj);

    // Assert: Verify farmerFilters and method call
    expect(component.farmerFilters.currentYearFilter).toEqual(mockYearObj);
    expect(component.farmerTransactionQuantityData).toHaveBeenCalled();
  });

  it('should update formattedChart and actorColors when data is "Farmer"', () => {
    // Arrange: Mock the actorData
    component.actorData = [{ name: 'Farmer Data' }, { name: 'Company Data' }];

    // Act: Call the method with "Farmer"
    component.changeActor('Farmer');

    // Assert: Verify updates to the state
    expect(component.actorFilters.currentActorType).toBe('Farmer');
    expect(component.formattedChart).toEqual([{ name: 'Farmer Data' }]);
    expect(component.actorColors).toEqual(['#5691AE']);
    expect(component.actorReportLoader).toBeFalse();
  });

  it('should update formattedChart and actorColors when data is "Company"', () => {
    // Arrange: Mock the actorData
    component.actorData = [{ name: 'Farmer Data' }, { name: 'Company Data' }];

    // Act: Call the method with "Company"
    component.changeActor('Company');

    // Assert: Verify updates to the state
    expect(component.actorFilters.currentActorType).toBe('Company');
    expect(component.formattedChart).toEqual([{ name: 'Company Data' }]);
    expect(component.actorColors).toEqual(['#003A60']);
    expect(component.actorReportLoader).toBeFalse();
  });

  it('should update formattedChart and actorColors when data is neither "Farmer" nor "Company"', () => {
    // Arrange: Mock the actorData
    component.actorData = [{ name: 'Farmer Data' }, { name: 'Company Data' }];

    // Act: Call the method with an invalid type
    component.changeActor('All');

    // Assert: Verify updates to the state
    expect(component.actorFilters.currentActorType).toBe('All');
    expect(component.formattedChart).toEqual(component.actorData); // Full actorData
    expect(component.actorColors).toEqual(['#5691AE', '#003A60']);
    expect(component.actorReportLoader).toBeFalse();
  });

  it('should set farmerLoader to true and call getfarmerTransactionData when data is "Transactions"', () => {
    // Arrange: Mock the initial state and methods
    component.farmerFilters = {
      innerFilter: '',
      currentYearFilter: null,
      currentProduct: '',
      filterItems: [],
    };
    spyOn(component, 'getfarmerTransactionData');

    // Act: Call the method with "Transactions"
    component.changeTransaction('Transactions');

    // Assert: Verify state and method call
    expect(component.farmerLoader).toBeTrue();
    expect(component.farmerFilters.innerFilter).toBe('Transactions');
    expect(component.getfarmerTransactionData).toHaveBeenCalled();
  });

  it('should set farmerLoader to true and call farmerTransactionQuantityData when data is not "Transactions"', () => {
    // Arrange: Mock the initial state and methods
    component.farmerFilters = {
      innerFilter: '',
      currentYearFilter: null,
      currentProduct: '',
      filterItems: [],
    };
    spyOn(component, 'farmerTransactionQuantityData');

    // Act: Call the method with "Quantity"
    component.changeTransaction('Quantity');

    // Assert: Verify state and method call
    expect(component.farmerLoader).toBeTrue();
    expect(component.farmerFilters.innerFilter).toBe('Quantity');
    expect(component.farmerTransactionQuantityData).toHaveBeenCalled();
  });
});
