import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Address } from '../models/address';

@Injectable({providedIn: 'root'})
export class CoreService {
    addressList: Address[];
    url = `${environment.server_url}/addressList`;

    constructor(private http: HttpClient) {}

    fetchAddressList(): Observable<Address[]> {
        return this.http.get<Address[]>(this.url);
    }
}
