import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesComponent } from './activities.component';
import { CompanyProfileService } from '../company-profile.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;
  let mockCompanyProfileService: jasmine.SpyObj<CompanyProfileService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CompanyProfileService', ['activityLog']);

    TestBed.configureTestingModule({
      declarations: [ActivitiesComponent],
      providers: [{ provide: CompanyProfileService, useValue: spy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    mockCompanyProfileService = TestBed.inject(
      CompanyProfileService
    ) as jasmine.SpyObj<CompanyProfileService>;

    // Mock the service call to avoid any real API interaction
    const mockResponse: ActivityLogResponse = { data: { results: [] } }; // Mock with explicit type
    mockCompanyProfileService.activityLog.and.returnValue(of(mockResponse));

    // Call ngOnInit to trigger initialization logic
    component.ngOnInit();
    fixture.detectChanges(); // Ensure change detection is triggered
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});

interface ActivityLogResponse {
  data: {
    results: any[]; // Replace `any[]` with a more specific type if you know the structure
  };
}
