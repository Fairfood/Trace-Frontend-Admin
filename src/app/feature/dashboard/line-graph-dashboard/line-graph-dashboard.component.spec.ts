import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphDashboardComponent } from './line-graph-dashboard.component';

describe('LineGraphDashboardComponent', () => {
  let component: LineGraphDashboardComponent;
  let fixture: ComponentFixture<LineGraphDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineGraphDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineGraphDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
