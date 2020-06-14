import { AddressDataService } from './address-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Address } from '../models/';

export class AddressDataSource implements DataSource<Address> {

    private addressSubject = new BehaviorSubject<Address[]>([]);
    private activeColumn = { active: null, direction: null };

    constructor(private addresDataService: AddressDataService) {}

    connect(): Observable<Address[]> {
        return this.addressSubject.asObservable();
    }

    disconnect(): void {
        this.addressSubject.complete();
    }

    loadAddresses() {
        this.addresDataService.getAddresses('default', 1)
            .subscribe(addresses => {
                this.addressSubject.next(addresses);
            });
    }

    getAddresses(column: string, sortDirection: string, pageIndex: number) {
        if (Object.values(this.activeColumn).includes(column)) {
            this.activeColumn.direction = sortDirection;
            const arr = this.addressSubject.value;
            const reverse = arr.map((el, i) => arr[arr.length - i - 1]);
            this.addressSubject.next(reverse);
        } else {
            this.activeColumn = { active: column, direction: sortDirection };
            this.addresDataService.getAddresses(column, pageIndex)
                .subscribe(addresses => this.addressSubject.next(addresses));
        }
    }

    updateAddresses(index, field, value) {
        const addresses = this.addressSubject.value.map((e, i) => {
          if (index === i && e[field].localeCompare(value) !== 0) {
            return {
              ...e,
              [field]: value
            };
          }
          return e;
        });

        this.addressSubject.next(addresses);
    }
}
