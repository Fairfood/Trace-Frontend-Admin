import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CompanyProfileService } from './company-profile.service';
import { environment } from 'src/environments/environment';
import { HTTP_OPTION_1 } from 'fairfood-utils';
// Import the successFormatter function and the module it resides in
import * as Formatter from 'src/app/shared/configs/app.config';

describe('CompanyProfileService', () => {
  let service: CompanyProfileService;
  let httpMock: HttpTestingController;

  const BASE_URL = environment.baseUrl;
  const mockId = '12345';
  const mockResponse = { companyName: 'Mock Company', id: mockId };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CompanyProfileService,
        {
          provide: 'formatter',
          useValue: jasmine.createSpy('successFormatter'),
        },
      ],
    });

    service = TestBed.inject(CompanyProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to the correct URL', () => {
    const mockResponse = { companyName: 'Mock Company', id: '12345' };

    service.getCompanyDetails('12345').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      BASE_URL + '/supply-chain/admin/company/12345/'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simulates a successful response
  });

  it('should apply successFormatter to the response', () => {
    const mockResponse = {
      code: 200,
      data: { id: '123', name: 'Mock Company' },
    };
    const formattedResponse = mockResponse.data;

    service.getCompanyDetails('12345').subscribe(response => {
      expect(response).toEqual(formattedResponse);
    });

    const req = httpMock.expectOne(
      BASE_URL + '/supply-chain/admin/company/12345/'
    );
    req.flush(mockResponse);
  });

  it('should handle HTTP errors gracefully', () => {
    const errorMessage = 'Not Found';

    service.getCompanyDetails('12345').subscribe(
      () => fail('Expected error, but got a success response'),
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(
      BASE_URL + '/supply-chain/admin/company/12345/'
    );
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' }); // Simulates an HTTP error
  });

  it('should send a POST request to invite a company', () => {
    const mockParams = {
      email: 'test@company.com',
      companyName: 'Test Company',
    };
    const mockResponse = {
      success: true,
      message: 'Company invited successfully',
    };

    service.inviteCompany(mockParams).subscribe(response => {
      expect(response.success).toBeTrue();
      expect(response.message).toBe('Company invited successfully');
    });

    const req = httpMock.expectOne(
      BASE_URL + '/supply-chain/admin/invite/company/'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockParams);
    req.flush(mockResponse); // Simulate a successful response
  });

  it('should handle HTTP errors', () => {
    const mockParams = {
      email: 'test@company.com',
      companyName: 'Test Company',
    };
    const errorMessage = 'Internal Server Error';

    service.inviteCompany(mockParams).subscribe(
      () => fail('Expected error, but got success'),
      error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(
      BASE_URL + '/supply-chain/admin/invite/company/'
    );
    req.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    }); // Simulate an error response
  });

  it('should correctly format countries with sub_divisions and codes', () => {
    const inputData = {
      Afghanistan: {
        alpha_2: 'AF',
        dial_code: '93',
        flag_url: 'https://fairtrace-v2-prod.s3.amazonaws.com/flags/af.png',
        id: 'Afghanistan',
        name: 'Afghanistan',
        latlong: [33, 65],
        sub_divisions: {
          Badakhshān: { latlong: [36.96542, 72.40596] },
          Baghlān: { latlong: [36.120094, 68.681862] },
          Balkh: { latlong: [36.758126, 66.898083] },
        },
      },
      Albania: {
        alpha_2: 'AL',
        dial_code: '355',
        flag_url: 'https://fairtrace-v2-prod.s3.amazonaws.com/flags/al.png',
        id: 'Albania',
        name: 'Albania',
        latlong: [41, 20],
        sub_divisions: {
          Berat: { latlong: [40.700952, 19.958004] },
          Bulqizë: { latlong: [41.492203, 20.218376] },
          Delvinë: { latlong: [39.949925, 20.097533] },
        },
      },
    };

    const expectedOutput = {
      countries: [
        {
          alpha_2: 'AF',
          dial_code: '93',
          flag_url: 'https://fairtrace-v2-prod.s3.amazonaws.com/flags/af.png',
          id: 'Afghanistan',
          name: 'Afghanistan',
          latlong: [33, 65],
          sub_divisions: {
            Badakhshān: { latlong: [36.96542, 72.40596] },
            Baghlān: { latlong: [36.120094, 68.681862] },
            Balkh: { latlong: [36.758126, 66.898083] },
          },
        },
        {
          alpha_2: 'AL',
          dial_code: '355',
          flag_url: 'https://fairtrace-v2-prod.s3.amazonaws.com/flags/al.png',
          id: 'Albania',
          name: 'Albania',
          latlong: [41, 20],
          sub_divisions: {
            Berat: { latlong: [40.700952, 19.958004] },
            Bulqizë: { latlong: [41.492203, 20.218376] },
            Delvinë: { latlong: [39.949925, 20.097533] },
          },
        },
      ],
      codes: [
        { id: '+93', name: 'Afghanistan (+93)' },
        { id: '+355', name: 'Albania (+355)' },
      ],
    };

    const result = service.formatCountries(inputData);

    // Check that countries array is formatted correctly
    expect(result.countries).toEqual(expectedOutput.countries);

    // Check that codes array is formatted correctly
    expect(result.codes).toEqual(expectedOutput.codes);
  });

  it('should return empty arrays if no data is provided', () => {
    const result = service.formatCountries({});

    // Ensure that the function returns empty arrays when no data is passed
    expect(result.countries).toEqual([]);
    expect(result.codes).toEqual([]);
  });

  it('should make a GET request to list the team of a company and return the response', () => {
    const companyId = '123';
    const offset = 0;
    const limit = 10;
    const mockResponse = {
      code: 200,
      data: {
        members: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' },
        ],
      },
    };

    // Call the function
    service.listTeamOfCompany(companyId, offset, limit).subscribe(response => {
      expect(response).toEqual(mockResponse.data);
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/company/${companyId}/member/?limit=${limit}&offset=${offset}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a GET request to get active supply chains and return the response', () => {
    const nodeId = '456'; // Replace with a mock node ID
    const offset = 0;
    const limit = 10;
    const mockResponse = {
      code: 200,
      data: {
        supplyChains: [
          { id: '1', name: 'Supply Chain 1' },
          { id: '2', name: 'Supply Chain 2' },
        ],
      },
    };

    // Call the function
    service.getActiveSupplyChains(nodeId, offset, limit).subscribe(response => {
      expect(response).toEqual(mockResponse.data);
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/supplychain/node/${nodeId}/?limit=${limit}&offset=${offset}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a GET request to get activity log', () => {
    const companyId = '123'; // Replace with a mock company ID
    const offset = 0;
    const limit = 10;
    const mockResponse = {}; // Mock response, adjust as needed

    // Call the function
    service.activityLog(companyId, offset, limit).subscribe(response => {
      expect(response).toEqual(mockResponse); // Assert that response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/company/activity/${companyId}/?limit=${limit}&offset=${offset}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a POST request to add active supply chains', () => {
    const companyId = '123'; // Replace with a mock company ID
    const params = { name: 'New Supply Chain' }; // Mock request body
    const mockResponse = { success: true, message: 'Supply chain added' }; // Mock response

    // Call the function
    service.addActiveSupplyChains(companyId, params).subscribe(response => {
      expect(response).toEqual(mockResponse); // Assert that the response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/node-supplychain/${companyId}/`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params); // Ensure the request body is correct
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a POST request to add themeability and return the response', () => {
    const nodeId = '123'; // Replace with a mock node ID
    const params = { themeName: 'Dark Mode' }; // Mock request body
    const mockResponse = {
      code: 201,
      data: { id: '1', themeName: 'Dark Mode' },
    }; // Mock response

    // Call the function
    service.addThemeablilty(nodeId, params).subscribe(response => {
      expect(response).toEqual(mockResponse.data); // Assert that the response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/theme/node/${nodeId}/`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params); // Ensure the request body is correct
    req.flush(mockResponse); // Provide the mock response
  });

  it('should return the full response when code is not 201', () => {
    const nodeId = '123';
    const params = { themeName: 'Light Mode' };
    const mockResponse = { code: 400, message: 'Invalid request' };

    service.addThemeablilty(nodeId, params).subscribe(response => {
      expect(response).toEqual(mockResponse); // Assert that the full response is returned
    });

    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/theme/node/${nodeId}/`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params);
    req.flush(mockResponse); // Provide the mock response
  });
  it('should make a POST request to sync with navigate and return the response', () => {
    const params = { projectId: '123', sync: true }; // Mock request body
    const mockResponse = {
      success: true,
      message: 'Sync completed successfully',
    }; // Mock response

    // Call the function
    service.syncWithNavigate(params).subscribe(response => {
      expect(response).toEqual(mockResponse); // Assert that the response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(`${BASE_URL}/projects/navigate-sync/`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params); // Ensure the request body is correct
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a POST request to validate company name and return the response', () => {
    const params = { companyName: 'Mock Company' }; // Mock request body
    const mockResponse = { success: true, message: 'Company name is valid' }; // Mock response

    // Call the function
    service.searchCompanyProxy(params).subscribe(response => {
      expect(response).toEqual(mockResponse); // Assert that the response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/validate/company-name/`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(params); // Ensure the request body is correct
    req.flush(mockResponse); // Provide the mock response
  });

  it('should make a GET request to get supply chain list for companies and return the response', () => {
    const nodeId = 'node123'; // Mock node ID
    const mockResponse = {
      code: 200,
      data: [
        { id: '1', name: 'Supply Chain 1' },
        { id: '2', name: 'Supply Chain 2' },
      ],
    }; // Mock response

    // Call the function
    service.supplychainListForCompanies(nodeId).subscribe(response => {
      expect(response).toEqual(mockResponse.data); // Assert that the response is as expected
    });

    // Mock HTTP request and response
    const req = httpMock.expectOne(
      `${BASE_URL}/supply-chain/admin/supplychain/?search=&limit=500&exclude_node=${nodeId}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide the mock response
  });
});
