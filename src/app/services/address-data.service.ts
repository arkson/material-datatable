import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Address } from '../models/';

@Injectable({providedIn: 'root'})
export class AddressDataService {
    addressList: Address[];

    constructor(private http: HttpClient) {}

    getAddresses(column: string, pageIndex: number): Observable<Address[]> {
        return this.http.get<Address[]>(`/api/v1/addresses?column=${column}&page=${pageIndex}`);
    }

    sendAddressData(data: Address) {
        this.http.post(
            `/api/v1/addresses/update`,
            data
        ).subscribe();
    }
}
