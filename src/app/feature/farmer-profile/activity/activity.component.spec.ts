import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityComponent } from './activity.component';
import { FarmerProfileService } from '../farmer-profile.service';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let mockService: jasmine.SpyObj<FarmerProfileService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('FarmerProfileService', [
      'farmerActivities',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      imports: [MatPaginatorModule],
      providers: [{ provide: FarmerProfileService, useValue: mockService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    component.farmerId = '123';
    mockService.farmerActivities.and.returnValue(
      of({ count: 1, results: [{}], loading: false })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update activities when farmerActivities is called', () => {
    component.farmerActivities(10, 0);
    expect(component.activities).toEqual({
      count: 1,
      results: [{}],
      loading: false,
    });
  });

  it('should call farmerActivities on paginatorEvent', () => {
    spyOn(component, 'farmerActivities');
    component.paginatorEvent({ limit: 5, offset: 10 });
    expect(component.farmerActivities).toHaveBeenCalledWith(5, 10);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });
});
