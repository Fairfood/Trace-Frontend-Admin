import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfPaginationComponent } from './ff-pagination.component';

describe('FfPaginationComponent', () => {
  let component: FfPaginationComponent;
  let fixture: ComponentFixture<FfPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FfPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FfPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
