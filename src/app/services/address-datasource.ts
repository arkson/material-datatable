import { AddressDataService } from './address-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';

import { TableVirtualScrollStrategy } from './../services/virtual-scroll.service';
import { Address } from '../models/';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export class AddressDataSource implements DataSource<Address> {
    // Manually set the amount of buffer and the height of the table elements
    static BUFFER_SIZE = 3;
    rowHeight = 48;
    headerHeight = 56;
    gridHeight = 400;

    private addressSubject = new BehaviorSubject<Address[]>([]);
    private activeColumn = { active: null, direction: null };
    public status: { [key: string]: { progress: Observable<number>; }; };

    constructor(
        private addressDataService: AddressDataService,
        private scrollStrategy: TableVirtualScrollStrategy
    ) {}

    connect(): Observable<Address[]> {
        return this.addressSubject.asObservable();
    }

    disconnect(): void {
        this.addressSubject.complete();
    }

    loadAddressList() {
        this.addressDataService.getAddressList('default', 1)
            .subscribe(addresses => {
                this.addressSubject.next(addresses);
            });
    }

    getAddressList(column: string, sortDirection: string, pageIndex: number) {
        if (Object.values(this.activeColumn).includes(column)) {
            this.activeColumn.direction = sortDirection;
            const arr = this.addressSubject.value;
            const reverse = arr.map((el, i) => arr[arr.length - i - 1]);
            this.addressSubject.next(reverse);
        } else {
            this.activeColumn = { active: column, direction: sortDirection };
            this.addressDataService.getAddressList(column, pageIndex)
                .subscribe(addresses => this.addressSubject.next(addresses));
        }
    }

    updateAddressList(index: number, field: string, value: string) {
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

    sendAddressList() {
        // For demo purposes send only 5 rows
        const list = this.addressSubject.value.slice(0, 5);
        this.status = this.addressDataService.uploadAddressList(list);
    }

    calculateVirtualScrollSize(): void {
        const range = Math.ceil(this.gridHeight / this.rowHeight) + AddressDataSource.BUFFER_SIZE;
        this.scrollStrategy.setScrollHeight(this.rowHeight, this.headerHeight);

        combineLatest([this.addressSubject.value, this.scrollStrategy.scrolledIndexChange]).pipe(
            map((value: any) => {

            // Determine the start and end rendered range
            const start = Math.max(0, value[1] - AddressDataSource.BUFFER_SIZE);
            const end = Math.min(value[0].length, value[1] + range);

            // Update the datasource for the rendered range of data
            return value[0].slice(start, end);
          })
        );
    }
}
