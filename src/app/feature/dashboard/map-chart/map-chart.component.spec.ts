import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapChartComponent } from './map-chart.component';
import { DashboardService } from '../dashboard.service';
import { DataService } from 'src/app/shared/services/data.service';
import { of, Subject } from 'rxjs';

describe('MapChartComponent', () => {
  let component: MapChartComponent;
  let fixture: ComponentFixture<MapChartComponent>;
  let dashboardServiceMock: jasmine.SpyObj<DashboardService>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let supplyChainDataChanged$: Subject<any>;

  beforeEach(async () => {
    dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
      'worldMapData',
    ]);
    dataServiceMock = jasmine.createSpyObj('DataService', [], {
      supplyChainDataChanged: new Subject<any>(),
    });
    supplyChainDataChanged$ =
      dataServiceMock.supplyChainDataChanged as Subject<any>;

    await TestBed.configureTestingModule({
      declarations: [MapChartComponent],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChartComponent);
    component = fixture.componentInstance;
    dashboardServiceMock.worldMapData.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch world map data on init', () => {
    spyOn(component, 'getWorldMapData').and.callThrough();
    supplyChainDataChanged$.next({
      type: 'supplyChain',
      value: 'TestSupplyChain',
    });

    expect(component.selectedSupplyChain).toBe('TestSupplyChain');
    expect(component.getWorldMapData).toHaveBeenCalled();
    expect(dashboardServiceMock.worldMapData).toHaveBeenCalledWith(
      'TestSupplyChain'
    );
  });

  it('should set country data when getWorldMapData is called', () => {
    const mockData = [
      {
        country_code: 'US',
        country: 'United States',
        count: 10,
        farmer_count: 5,
        company_count: 5,
      },
    ];
    dashboardServiceMock.worldMapData.and.returnValue(of(mockData));

    component.getWorldMapData();

    expect(component.countryData).toEqual(mockData);
  });
  it('should call setPolygonData with "farmer_count" when changeLegend is called with "Farmer"', () => {
    spyOn(component, 'setPolygonData');
    component.changeLegend('Farmer');
    expect(component.mapFilter).toBe('Farmer');
    expect(component.setPolygonData).toHaveBeenCalledWith('farmer_count');
  });

  it('should call setPolygonData with "company_count" when changeLegend is called with "Company"', () => {
    spyOn(component, 'setPolygonData');
    component.changeLegend('Company');
    expect(component.mapFilter).toBe('Company');
    expect(component.setPolygonData).toHaveBeenCalledWith('company_count');
  });

  it('should call setPolygonData with "count" when changeLegend is called with "All"', () => {
    spyOn(component, 'setPolygonData');
    component.changeLegend('All');
    expect(component.mapFilter).toBe('All');
    expect(component.setPolygonData).toHaveBeenCalledWith('count');
  });

  it('should call setPolygonData with "count" when changeLegend is called with an unexpected value', () => {
    spyOn(component, 'setPolygonData');
    component.changeLegend('InvalidValue');
    expect(component.mapFilter).toBe('InvalidValue');
    expect(component.setPolygonData).toHaveBeenCalledWith('count');
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    spyOn(component.pageApis[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.pageApis[0].unsubscribe).toHaveBeenCalled();
  });
});
