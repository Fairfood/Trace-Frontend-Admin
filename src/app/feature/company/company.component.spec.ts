import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DataService } from 'src/app/shared/services';
import { FeatureService } from '../feature.service';
import { CompanyProfileService } from '../company-profile/company-profile.service';
import { of, throwError, BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  exportFileType,
  exportType,
} from 'src/app/shared/configs/app.constants';
import { nFormatter } from 'src/app/shared/configs/app.config';

describe('CompanyComponent', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockFeatureService: jasmine.SpyObj<FeatureService>;
  let mockCompanyProfileService: jasmine.SpyObj<CompanyProfileService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockDataService = jasmine.createSpyObj('DataService', [
      'fetchAllSupplyChains',
    ]);
    mockFeatureService = jasmine.createSpyObj('FeatureService', [
      'getCountryList',
      'getCompanyList',
    ]); // Include getCompanyList
    mockCompanyProfileService = jasmine.createSpyObj('CompanyProfileService', [
      'formatCountries',
    ]);
    mockDataService.hideSupplyChain = new BehaviorSubject<string>('');

    mockDataService.fetchAllSupplyChains.and.returnValue(of([])); // Mock fetchAllSupplyChains to return an observable
    mockFeatureService.getCompanyList.and.returnValue(
      of({ results: [], count: 0 })
    ); // Mock getCompanyList to return an observable

    mockDataService.exportDataInit = new Subject<any>(); // Subject that will be emitted to
    spyOn(mockDataService.exportDataInit, 'next'); // Spy on the 'next' method

    // Mock initExportData method to do nothing, as it's not being tested here
    mockDataService.initExportData = jasmine
      .createSpy('initExportData')
      .and.callFake(params => {
        mockDataService.exportDataInit.next(params); // Call next with the provided params
      });

    await TestBed.configureTestingModule({
      imports: [CompanyComponent, HttpClientModule, MatSnackBarModule],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: FeatureService, useValue: mockFeatureService },
        { provide: CompanyProfileService, useValue: mockCompanyProfileService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component = new CompanyComponent(
      mockFeatureService,
      mockDataService,
      mockRouter,
      mockCompanyProfileService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadCompanies', () => {
    it('should set loading to true and call companyList', () => {
      spyOn(component, 'companyList');
      component.loadCompanies();
      expect(component.loading).toBeTrue();
      expect(component.companyList).toHaveBeenCalled();
    });
  });

  describe('companyList', () => {
    it('should set dataSource and totalCount on successful API response', () => {
      const mockResponse = {
        results: [
          { id: 1, name: 'Company A' },
          { id: 2, name: 'Company B' },
        ],
        count: 2,
      };

      mockFeatureService.getCompanyList.and.returnValue(of(mockResponse)); // Mock API response

      component.companyList();

      expect(mockFeatureService.getCompanyList).toHaveBeenCalledWith(
        component.appliedFilters
      );
      expect(component.dataSource).toEqual(mockResponse.results);
      expect(component.totalCount).toBe(mockResponse.count);
      expect(component.loading).toBeFalse();
    });

    it('should handle error and reset dataSource and totalCount', () => {
      mockFeatureService.getCompanyList.and.returnValue(
        throwError(() => new Error('API Error'))
      ); // Mock error response

      component.companyList();

      expect(mockFeatureService.getCompanyList).toHaveBeenCalledWith(
        component.appliedFilters
      );
      expect(component.dataSource).toEqual([]);
      expect(component.totalCount).toBe(0);
      expect(component.loading).toBeFalse();
    });
  });

  describe('getSupplyChains', () => {
    it('should fetch supply chains and call getCountries', () => {
      const mockSupplyChains = [{ id: 1, name: 'Supply Chain A' }];
      mockDataService.fetchAllSupplyChains.and.returnValue(
        of(mockSupplyChains)
      );
      spyOn(component, 'getCountries');

      component.getSupplyChains();

      expect(mockDataService.fetchAllSupplyChains).toHaveBeenCalledWith('');
      expect(component.supplyChainList).toEqual(mockSupplyChains);
      expect(component.getCountries).toHaveBeenCalled();
    });
  });

  describe('getCountries', () => {
    it('should fetch countries and update country list, then call homeStatistics and companyList', () => {
      const mockCountriesResponse = [{ code: 'US', name: 'United States' }];
      const formattedCountries = {
        countries: [{ code: 'US', name: 'United States' }],
      };

      mockFeatureService.getCountryList.and.returnValue(
        of(mockCountriesResponse)
      );
      mockCompanyProfileService.formatCountries.and.returnValue(
        formattedCountries
      );
      spyOn(component, 'homeStatistics');
      spyOn(component, 'companyList');

      component.getCountries();

      expect(mockFeatureService.getCountryList).toHaveBeenCalled();
      expect(mockCompanyProfileService.formatCountries).toHaveBeenCalledWith(
        mockCountriesResponse
      );
      expect(component.countryList).toEqual(formattedCountries.countries);
      expect(component.homeStatistics).toHaveBeenCalled();
      expect(component.companyList).toHaveBeenCalled();
    });
  });

  describe('paginatorEvent', () => {
    it('should update appliedFilters and call loadCompanies', () => {
      spyOn(component, 'loadCompanies');
      const mockData = { limit: 20, offset: 40 };
      component.paginatorEvent(mockData);
      expect(component.appliedFilters.limit).toBe(20);
      expect(component.appliedFilters.offset).toBe(40);
      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('searchFilter', () => {
    it('should update appliedFilters and call loadCompanies', () => {
      spyOn(component, 'loadCompanies');
      const mockSearchString = 'Test search';
      component.searchFilter(mockSearchString);
      expect(component.appliedFilters.searchString).toBe(mockSearchString);
      expect(component.appliedFilters.limit).toBe(10);
      expect(component.appliedFilters.offset).toBe(0);
      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('otherFilters', () => {
    it('should update selectedSupplyChain filter and call loadCompanies for supply type', () => {
      spyOn(component, 'loadCompanies');

      const mockData = { id: '123' };
      component.otherFilters(mockData, 'supply');
      expect(component.appliedFilters.selectedSupplyChain).toBe('123');
      expect(component.loadCompanies).toHaveBeenCalled();
    });

    it('should update selectedCountry filter and call loadCompanies for country type', () => {
      spyOn(component, 'loadCompanies');

      const mockData = { id: '456' };
      component.otherFilters(mockData, 'country');
      expect(component.appliedFilters.selectedCountry).toBe('456');
      expect(component.loadCompanies).toHaveBeenCalled();
    });

    it('should update status filter and call loadCompanies for other types', () => {
      spyOn(component, 'loadCompanies');

      const mockData = { id: 'Active' };
      component.otherFilters(mockData, 'status');
      expect(component.appliedFilters.status).toBe('Active');
      expect(component.loadCompanies).toHaveBeenCalled();
    });

    it('should set filter to empty if id is "All"', () => {
      spyOn(component, 'loadCompanies');

      const mockData = { id: 'All' };
      component.otherFilters(mockData, 'supply');
      expect(component.appliedFilters.selectedSupplyChain).toBe('');
      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('inviteCompany', () => {
    it('should toggle invite and reload if data is "reload"', () => {
      spyOn(component, 'resetFilter');
      spyOn(component, 'loadCompanies');
      component.inviteCompany('reload');
      expect(component.invite).toBe(true);
      expect(component.resetFilter).toHaveBeenCalled();
      expect(component.loadCompanies).toHaveBeenCalled();
    });

    it('should toggle invite and reload if no data is passed', () => {
      spyOn(component, 'resetFilter');
      spyOn(component, 'loadCompanies');
      component.inviteCompany();
      expect(component.invite).toBe(true);
      expect(component.resetFilter).toHaveBeenCalled();
      expect(component.loadCompanies).toHaveBeenCalled();
    });
  });

  describe('filterClicked', () => {
    beforeEach(() => {
      component.toggleFilter = true;
      spyOn(component, 'resetFilter');
      spyOn(component, 'loadCompanies');
    });

    it('should toggle filter and reset filters when toggleFilter is true', () => {
      component.filterClicked();
      expect(component.toggleFilter).toBeFalse();
      expect(component.resetFilter).toHaveBeenCalled();
      expect(component.loadCompanies).toHaveBeenCalled();
    });

    it('should toggle filter without resetting filters when toggleFilter is false', () => {
      component.toggleFilter = false;
      component.filterClicked();
      expect(component.toggleFilter).toBeTrue();
      expect(component.resetFilter).not.toHaveBeenCalled();
      expect(component.loadCompanies).not.toHaveBeenCalled();
    });
  });

  describe('viewDetails', () => {
    it('should navigate to the correct URL', () => {
      const mockId = '123';
      component.viewDetails(mockId);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        '/company-profile/123'
      );
    });
  });

  describe('sortData', () => {
    beforeEach(() => {
      spyOn(component, 'loadCompanies');
    });

    const testCases = [
      { column: 'created_on', expectedSortBy: 'created_on' },
      { column: 'status', expectedSortBy: 'status' },
      { column: 'country', expectedSortBy: 'country' },
      { column: 'name', expectedSortBy: 'name' },
      { column: 'supplyChain', expectedSortBy: 'supplyChain' },
      { column: 'farmer', expectedSortBy: 'farmer' },
      { column: 'transaction', expectedSortBy: 'transaction' },
      { column: 'unknown_column', expectedSortBy: 'created_on' },
    ];

    testCases.forEach(({ column, expectedSortBy }) => {
      it(`should handle column "${column}" and set sortBy to "${expectedSortBy}"`, () => {
        component.appliedFilters = { sortBy: 'name', orderBy: 'asc' };

        component.sortData(column);

        expect(component.appliedFilters.sortBy).toBe(expectedSortBy);
        if (column === 'name') {
          expect(component.appliedFilters.orderBy).toBe('desc');
        } else {
          expect(component.appliedFilters.orderBy).toBe('asc');
        }
        expect(component.loadCompanies).toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all APIs', () => {
      const mockSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.pageApis = [mockSubscription, mockSubscription];

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(2);
    });
  });

  describe('initExport', () => {
    it('should call initExportData with the correct parameters', () => {
      component.appliedFilters = {
        searchString: 'test',
        status: 'active',
        selectedSupplyChain: 'supplyChainId',
        selectedCountry: 'countryId',
      };

      const expectedParams = {
        search: 'test',
        status: 'active',
        supply_chain: 'supplyChainId',
        country: 'countryId',
      };

      component.initExport();

      expect(mockDataService.initExportData).toHaveBeenCalledWith({
        export_type: exportType.ADMIN_COMPANY,
        filters: JSON.stringify(expectedParams),
        file_type: exportFileType.EXCEL,
      });

      expect(mockDataService.exportDataInit.next).toHaveBeenCalledWith({
        export_type: exportType.ADMIN_COMPANY,
        filters: JSON.stringify(expectedParams),
        file_type: exportFileType.EXCEL,
      });
    });

    it('should handle empty appliedFilters gracefully', () => {
      component.appliedFilters = {
        searchString: '',
        status: '',
        selectedSupplyChain: '',
        selectedCountry: '',
      };

      const expectedParams = {
        search: '',
        status: '',
        supply_chain: '',
        country: '',
      };

      component.initExport();

      expect(mockDataService.initExportData).toHaveBeenCalledWith({
        export_type: exportType.ADMIN_COMPANY,
        filters: JSON.stringify(expectedParams),
        file_type: exportFileType.EXCEL,
      });

      expect(mockDataService.exportDataInit.next).toHaveBeenCalledWith({
        export_type: exportType.ADMIN_COMPANY,
        filters: JSON.stringify(expectedParams),
        file_type: exportFileType.EXCEL,
      });
    });
  });

  // describe('homeStatistics', () => {
  //   let mockFeatureService: jasmine.SpyObj<FeatureService>;
  //   let mockActorReportData: jasmine.Spy;

  //   beforeEach(() => {
  //     mockFeatureService = jasmine.createSpyObj('FeatureService', ['statisticsData']);
  //     mockActorReportData = spyOn(component, 'actorReportData');

  //     // Spy on the named nFormatter function
  //     spyOn(nFormatter, 'default').and.callThrough();

  //   });

  //   it('should process statistics and set companyStatistics correctly on success', () => {
  //     // Arrange: Mock the API response
  //     const mockResponse = {
  //       companies: 1000,
  //       active_companies: 800,
  //       transactions: 5000,
  //     };
  //     mockFeatureService.statisticsData.and.returnValue(of(mockResponse));

  //     // Act: Call the homeStatistics method
  //     component.homeStatistics();

  //     // Assert: Check if statistics data is processed and companyStatistics is set correctly
  //     expect(component.companyStatistics).toEqual({
  //       companies: {
  //         title: 1000,
  //         value: nFormatter(1000),  // Assuming nFormatter is used to format values
  //       },
  //       activeCompanies: {
  //         title: 800,
  //         value: nFormatter(800),
  //       },
  //       transactions: {
  //         title: 5000,
  //         value: nFormatter(5000),
  //       },
  //     });

  //     // Assert: Check if actorReportData was called
  //     expect(mockActorReportData).toHaveBeenCalled();
  //   });

  //   it('should handle failure gracefully and set companyStatistics to null', () => {
  //     // Arrange: Mock the API to throw an error
  //     mockFeatureService.statisticsData.and.returnValue(throwError('API error'));

  //     // Act: Call the homeStatistics method
  //     component.homeStatistics();

  //     // Assert: Check if companyStatistics is set to null on error
  //     expect(component.companyStatistics).toBeNull();

  //     // Assert: Check if actorReportData was called
  //     expect(mockActorReportData).toHaveBeenCalled();
  //   });
  // });
});
