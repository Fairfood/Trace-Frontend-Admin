import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { successFormatter } from 'src/app/shared/configs/app.config';
import { YearObj } from './dashboard.config';
const BASE_URL = environment.baseUrl;
const mockWorldMapResponse = [
  { country: 'USA', count: 50 },
  { country: 'India', count: 30 },
  { country: 'Germany', count: 20 },
];

const mockProductResponse = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  { id: 3, name: 'Product 3' },
];

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService],
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch actor report data', () => {
    const mockResponse = { data: 'some data' };
    const type = 'someType';
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    const product = 'someProduct';
    const supplyChain = 'someSupplyChain';
    const expectedUrl = `${environment.baseUrl}/supply-chain/admin/node-count/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}&supply_chain=${supplyChain}&product=${product}`;

    service
      .actorReportData(type, startDate, endDate, product, supplyChain)
      .subscribe(response => {
        expect(response).toEqual(successFormatter(mockResponse));
      });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch actor transaction report data', () => {
    const mockResponse = { data: 'some data' };
    const type = 'someType';
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    const product = 'someProduct';
    const supplyChain = 'someSupplyChain';
    const expectedUrl = `${environment.baseUrl}/transactions/admin/external-transaction-count/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}&supply_chain=${supplyChain}&product=${product}`;

    service
      .actorTransactionReportData(
        type,
        startDate,
        endDate,
        product,
        supplyChain
      )
      .subscribe(response => {
        expect(response).toEqual(successFormatter(mockResponse));
      });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch farmer quantity report data', () => {
    const mockResponse = { data: 'some data' };
    const type = 'someType';
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    const product = 'someProduct';
    const supplyChain = 'someSupplyChain';
    const expectedUrl = `${environment.baseUrl}/transactions/admin/external-transaction-quantity/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}&supply_chain=${supplyChain}&product=${product}`;

    service
      .farmerQuantityReportData(type, startDate, endDate, product, supplyChain)
      .subscribe(response => {
        expect(response).toEqual(successFormatter(mockResponse));
      });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch world map data correctly', () => {
    const supplyChainId = '12345'; // Example supply chain ID
    const expectedUrl = `${BASE_URL}/supply-chain/admin/country-node-count/?supply_chain=${supplyChainId}`;

    // Call the service method
    service.worldMapData(supplyChainId).subscribe(response => {
      // Assert that the response matches the mock data
      expect(response).toEqual(mockWorldMapResponse);
    });

    // Mock the HTTP request
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET'); // Ensure it's a GET request
    req.flush(mockWorldMapResponse); // Return the mock data as the response
  });

  it('should fetch products correctly', () => {
    const supplyChainId = '12345'; // Example supply chain ID
    const expectedUrl = `${BASE_URL}/supply-chain/admin/products/?limit=1000&supply_chain=${supplyChainId}`;

    // Call the service method
    service.fetchProducts(supplyChainId).subscribe(response => {
      // Assert that the response matches the mock data
      expect(response).toEqual(mockProductResponse);
    });

    // Mock the HTTP request
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET'); // Ensure it's a GET request
    req.flush(mockProductResponse); // Return the mock data as the response
  });
});
