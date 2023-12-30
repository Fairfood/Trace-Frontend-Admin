import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChartComponent } from './map-chart.component';

describe('MapChartComponent', () => {
  let component: MapChartComponent;
  let fixture: ComponentFixture<MapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
