import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyProfileComponent } from './company-profile.component';
import { CompanyProfileService } from './company-profile.service';
import { DataService } from 'src/app/shared/services/data.service';
import { ACTION_TYPE } from 'src/app/shared/configs/app.constants';

describe('CompanyProfileComponent', () => {
  let component: CompanyProfileComponent;
  let fixture: ComponentFixture<CompanyProfileComponent>;
  let mockCompanyProfileService: any;
  let mockDataService: any;

  beforeEach(async () => {
    mockCompanyProfileService = {
      getCompanyDetails: jasmine
        .createSpy('getCompanyDetails')
        .and.returnValue(of({})),
      addThemeablilty: jasmine
        .createSpy('addThemeablilty')
        .and.returnValue(of({})),
      viewingAsAdmin: jasmine.createSpy('viewingAsAdmin'),
    };

    mockDataService = {
      hideSupplyChain: { next: jasmine.createSpy('next') },
      customSnackBar: jasmine.createSpy('customSnackBar'),
    };

    await TestBed.configureTestingModule({
      declarations: [CompanyProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '123' },
            },
          },
        },
        { provide: CompanyProfileService, useValue: mockCompanyProfileService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and update company profile data in profileData()', () => {
    const mockResponse = {
      name: 'Test Company',
      features: {
        dashboard_theming: true,
        consumer_interface_theming: false,
        link_navigate: true,
        link_connect: false,
      },
    };

    // Mock the service response
    mockCompanyProfileService.getCompanyDetails.and.returnValue(
      of(mockResponse)
    );

    // Call the method explicitly
    component.pageApis = []; // Ensure pageApis is reset before calling the method
    component.profileData();

    // Verify method behavior
    expect(mockCompanyProfileService.getCompanyDetails).toHaveBeenCalledWith(
      '123'
    );
    expect(component.dataLoaded).toBeTrue();
    expect(component.companyProfileData).toEqual(mockResponse);
    expect(component.companyProfileData.icon).toBe('TC');
    expect(component.dashboardTheming).toBeTrue();
    expect(component.storyTheming).toBeFalse();
    expect(component.navigateEnabled).toBeTrue();
    expect(component.connectEnabled).toBeFalse();

    // Check the length of pageApis
    expect(component.pageApis.length).toBe(1); // Ensure only one subscription is added
  });

  it('should update activeTabId when changeTab is called', () => {
    const mockTabData = { id: 'tab2' }; // Mock data object
    component.changeTab(mockTabData);
    expect(component.activeTabId).toBe('tab2'); // Verify that activeTabId is updated
  });

  it('should call viewingAsAdmin with companyProfileData when navigateToDashboard is called', () => {
    const mockCompanyProfileData = { id: '123', name: 'Test Company' }; // Mock data
    component.companyProfileData = mockCompanyProfileData;

    component.navigateToDashboard();

    expect(mockCompanyProfileService.viewingAsAdmin).toHaveBeenCalledWith(
      mockCompanyProfileData
    );
  });

  it('should set isUpdating to true and call updateSettings with the correct params for type 1', () => {
    const mockEvent = { target: { checked: true } }; // Mock event
    spyOn(component, 'updateSettings'); // Spy on updateSettings

    component.themeSetting(mockEvent, 1);

    expect(component.isUpdating).toBeTrue();
    expect(component.updateSettings).toHaveBeenCalledWith({
      dashboard_theming: true,
    });
  });

  it('should set isUpdating to true and call updateSettings with the correct params for type 2', () => {
    const mockEvent = { target: { checked: false } }; // Mock event
    spyOn(component, 'updateSettings'); // Spy on updateSettings

    component.themeSetting(mockEvent, 2);

    expect(component.isUpdating).toBeTrue();
    expect(component.updateSettings).toHaveBeenCalledWith({
      consumer_interface_theming: false,
    });
  });

  it('should call addThemeablilty and handle success response', () => {
    const mockParams = { dashboard_theming: true }; // Mock params
    const mockCallback = jasmine.createSpy('callback'); // Mock callback function

    // Ensure pageApis is reset before the test
    component.pageApis = [];

    // Mock the service response
    mockCompanyProfileService.addThemeablilty.and.returnValue(of({}));

    component.updateSettings(mockParams, mockCallback);

    // Assertions
    expect(mockCompanyProfileService.addThemeablilty).toHaveBeenCalledWith(
      component.companyId,
      mockParams
    );
    expect(mockDataService.customSnackBar).toHaveBeenCalledWith(
      'Configuration updated successfully',
      ACTION_TYPE.SUCCESS
    );
    expect(component.isUpdating).toBeFalse();
    expect(mockCallback).toHaveBeenCalled();
    expect(component.pageApis.length).toBe(1); // Ensure only one subscription is added
  });

  it('should call addThemeablilty and handle error response', fakeAsync(() => {
    const mockParams = { consumer_interface_theming: false }; // Mock params
    const mockCallback = jasmine.createSpy('callback'); // Mock callback function

    // Mock the service response to return an error
    mockCompanyProfileService.addThemeablilty.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.updateSettings(mockParams, mockCallback);

    tick(); // Simulate the passage of time for async code to complete

    // Assertions after the async code completes
    expect(mockCompanyProfileService.addThemeablilty).toHaveBeenCalledWith(
      component.companyId,
      mockParams
    );
    expect(mockDataService.customSnackBar).toHaveBeenCalledWith(
      'Something went wrong!',
      ACTION_TYPE.FAILED
    );
    expect(component.isUpdating).toBeFalse();
    expect(mockCallback).toHaveBeenCalled(); // Ensure the callback is called (even on error)
  }));
});
