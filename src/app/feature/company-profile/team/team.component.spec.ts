import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TeamComponent } from './team.component';
import { CompanyProfileService } from '../company-profile.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

interface TeamMember {
  id: number;
  name: string;
}

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;
  let mockCompanyProfileService: jasmine.SpyObj<CompanyProfileService>;

  beforeEach(async () => {
    // Mock the CompanyProfileService with the necessary method
    mockCompanyProfileService = jasmine.createSpyObj('CompanyProfileService', [
      'listTeamOfCompany',
    ]);

    // Mock the service method to return an observable (even if it returns empty)
    mockCompanyProfileService.listTeamOfCompany.and.returnValue(
      of({ results: [], count: 0 })
    );

    await TestBed.configureTestingModule({
      declarations: [TeamComponent],
      providers: [
        { provide: CompanyProfileService, useValue: mockCompanyProfileService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore any missing child components for now
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    component.companyId = 'test-company-id'; // Set the companyId here
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Test to check if the component is created
    expect(component).toBeTruthy();
  });

  it('should call listTeamOfCompany method on ngOnInit', () => {
    const mockResponse = {
      results: [{ id: 1, name: 'John Doe' }] as TeamMember[], // Properly typed
      count: 0,
    };

    // Ensure listTeamOfCompany returns an observable
    mockCompanyProfileService.listTeamOfCompany.and.returnValue(
      of(mockResponse)
    );

    component.ngOnInit();

    expect(mockCompanyProfileService.listTeamOfCompany).toHaveBeenCalledWith(
      'test-company-id',
      component.filters.offset,
      component.filters.limit
    );
  });

  it('should fetch team member data correctly on successful API call', () => {
    const mockResponse = {
      results: [{ id: 1, name: 'John Doe' }] as TeamMember[], // Properly typed
      count: 1,
    };

    // Ensure the service method returns an observable with mock data
    mockCompanyProfileService.listTeamOfCompany.and.returnValue(
      of(mockResponse)
    );

    component.teamMemberData();

    // Check if the component received and processed the data correctly
    expect(component.dataSource).toEqual(mockResponse.results);
    expect(component.totalCount).toEqual(mockResponse.count);
    expect(component.loading).toBeFalse();
  });

  it('should handle error and set empty dataSource on API failure', () => {
    // Ensure the service returns an observable that throws an error
    mockCompanyProfileService.listTeamOfCompany.and.returnValue(
      throwError('Error')
    );

    component.teamMemberData();

    // Check if the component handled the error and cleared the dataSource
    expect(component.dataSource).toEqual([]);
    expect(component.loading).toBeFalse();
  });

  it('should unsubscribe from APIs on ngOnDestroy', () => {
    const mockSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.pageApis.push(mockSubscription);

    component.ngOnDestroy();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});
