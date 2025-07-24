import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FarmerProfileService } from './farmer-profile.service';
import { HTTP_OPTION_1, headerOptions } from 'fairfood-utils';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

const BASE_URL = environment.baseUrl;

describe('FarmerProfileService', () => {
  let service: FarmerProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FarmerProfileService],
    });
    service = TestBed.inject(FarmerProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch farmer payments', () => {
    const mockResponse: {
      data: { count: number; results: any[] };
      success: boolean;
    } = { data: { count: 2, results: [] }, success: true };
    const farmerId = '123';

    service.getFarmerPayments(farmerId).subscribe(res => {
      expect(res.count).toBe(2);
      expect(res.results).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/projects/projects/payments/?farmer=${farmerId}&limit=10&offset=0&search=`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch farmer activities', () => {
    const mockResponse: {
      data: { count: number; results: any[] };
      success: boolean;
    } = { data: { count: 1, results: [] }, success: true };
    const farmerId = '123';

    service.farmerActivities(farmerId).subscribe(res => {
      expect(res.count).toBe(1);
      expect(res.results).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/activity/node/?node=${farmerId}&limit=10&offset=0`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch farmer references', () => {
    const mockResponse: {
      data: { count: number; results: any[] };
      success: boolean;
    } = { data: { count: 3, results: [] }, success: true };
    const farmerId = '123';

    service.fetchFarmerReferences(farmerId).subscribe(res => {
      expect(res.count).toBe(3);
      expect(res.results).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/supply-chains/farmer-references/?farmer=${farmerId}&search=`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch farmer plots', () => {
    const mockResponse: {
      data: { count: number; results: any[] };
      success: boolean;
    } = { data: { count: 4, results: [] }, success: true };
    const farmerId = '123';

    service.getFarmerPlots(farmerId).subscribe(res => {
      expect(res.count).toBe(4);
      expect(res.results).toEqual([]);
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/supply-chains/farmer-plots/?farmer=${farmerId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return correct HTTP options', () => {
    const mockAdminData = JSON.stringify({
      token: 'mockToken',
      id: 'mockUserId',
    });
    spyOn(localStorage, 'getItem').and.returnValue(mockAdminData);

    const httpOptions = service.options();

    expect(httpOptions.headers instanceof HttpHeaders).toBeTrue();
    expect(httpOptions.headers.get('Content-Type')).toBe('application/json');
    expect(httpOptions.headers.get('Bearer')).toBe('mockToken');
    expect(httpOptions.headers.get('User-ID')).toBe('mockUserId');
  });
});
