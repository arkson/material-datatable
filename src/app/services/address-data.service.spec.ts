import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddressDataService } from './address-data.service';

const dummyAddressListResponse = [
    { streetNumber: '1', street: 'Jesse Hill Jr Street', city: 'Atlanta', state: 'TN', zipCode: '30309' },
    { streetNumber: '1', street: 'Cherokee Ave', city: 'Brookhaven', state: 'AL', zipCode: '30301' },
    { streetNumber: '1', street: 'Donald Lee Hollowell Parkway', city: 'Sandy Sprints', state: 'TN', zipCode: '30305' }
];

describe('Address Data Service', () => {
    let injector: TestBed;
    let service: AddressDataService;
    let httpMock: HttpTestingController;


    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ HttpClientTestingModule ],
          providers: [ AddressDataService ],
        });

        injector = getTestBed();
        service = TestBed.inject(AddressDataService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getAddressList() should return data', () => {
        service.getAddressList('default', 1).subscribe((res) => {
          expect(res).toEqual(dummyAddressListResponse);
        });

        const req = httpMock.expectOne('/api/v1/address?column=default&page=1');
        expect(req.request.method).toBe('GET');
        req.flush(dummyAddressListResponse);
    });
});
