import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmerProfileComponent } from './farmer-profile.component';
import { FeatureService } from '../feature.service';
import { FarmerProfileService } from './farmer-profile.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IReference } from './farmer-profile.config';

describe('FarmerProfileComponent', () => {
  let component: FarmerProfileComponent;
  let fixture: ComponentFixture<FarmerProfileComponent>;
  let mockFeatureService: jasmine.SpyObj<FeatureService>;
  let mockFarmerProfileService: jasmine.SpyObj<FarmerProfileService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Define mock reference data at the start
    const mockReferences: IReference = {
      count: 1,
      loading: false,
      results: [
        {
          reference_details: {
            name: 'Reference 1',
            description: 'Description 1',
            image: 'image1.png',
          },
        },
      ],
    };

    // Create mock services with spies
    mockFeatureService = jasmine.createSpyObj('FeatureService', [
      'getFarmerProfile',
    ]);
    mockFarmerProfileService = jasmine.createSpyObj('FarmerProfileService', [
      'fetchFarmerReferences',
    ]);

    // Mock method return values before component instantiation
    mockFeatureService.getFarmerProfile.and.returnValue(
      of({ name: 'John Doe', total_income: {} })
    );
    mockFarmerProfileService.fetchFarmerReferences.and.returnValue(
      of(mockReferences)
    );

    mockActivatedRoute = {
      snapshot: { params: { id: '123' } },
    };

    await TestBed.configureTestingModule({
      declarations: [FarmerProfileComponent],
      providers: [
        { provide: FeatureService, useValue: mockFeatureService },
        { provide: FarmerProfileService, useValue: mockFarmerProfileService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmerProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data on ngOnInit', () => {
    const mockProfileData = { name: 'John Doe', total_income: {} };
    mockFeatureService.getFarmerProfile.and.returnValue(of(mockProfileData)); // Ensure this is defined before ngOnInit()

    spyOn(component, 'formatIncome');
    spyOn(component, 'getReferences');

    component.ngOnInit();
    fixture.detectChanges(); // Ensure data binding updates

    expect(component.farmerProfileData).toEqual(mockProfileData);
    expect(component.farmerProfileData.icon).toBe('JD');
    expect(mockFeatureService.getFarmerProfile).toHaveBeenCalledWith('123');
    expect(component.formatIncome).toHaveBeenCalled();
    expect(component.getReferences).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const mockSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.pageApis.push(mockSubscription);

    component.ngOnDestroy();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should correctly format income in formatIncome()', () => {
    component.farmerProfileData = {
      total_income: {
        total_amount: [{ amount: 5000, currency: 'USD' }],
        amount_from_products: [{ amount: 3000, currency: 'USD' }],
        amount_from_premiums: [{ amount: 2000, currency: 'USD' }],
      },
    };

    component.formatIncome();

    expect(component.farmerProfileData.income).toEqual({
      product: '3,000 USD',
      premium: '2,000 USD',
      others: '0 USD',
      total: '5,000 USD',
    });
  });

  it('should set default income values if total_income is missing', () => {
    component.farmerProfileData = {};
    component.formatIncome();

    expect(component.farmerProfileData.income).toEqual({
      product: 0,
      premium: 0,
      others: 0,
      total: 0,
    });
  });
});
