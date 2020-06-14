import { AddressDataSource } from './../services/address-datasource';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { AddressDataService } from '../services/address-data.service';

import { Address, SortAddress } from '../models/';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {

  dataSource: AddressDataSource;
  columnsToDisplay: string[] = [ 'streetNumber', 'street', 'city', 'state', 'zipCode' ];
  controls: FormArray;
  toGroups: FormGroup[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private addressDataService: AddressDataService) {
  }

  ngOnInit(): void {
    this.dataSource = new AddressDataSource(this.addressDataService);
    this.dataSource.loadAddresses();

    this.dataSource.connect().subscribe(values => {
      const toGroups = values.map(entity => {
        return new FormGroup({
          streetNumber:  new FormControl(entity.streetNumber, Validators.required),
          street: new FormControl(entity.street, Validators.required),
          city: new FormControl(entity.city, Validators.required),
          zipCode: new FormControl(entity.zipCode, Validators.required),
          state: new FormControl(entity.state, Validators.required)
        }, {updateOn: 'blur'});
      });

      this.controls = new FormArray(toGroups);
    });

  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(
      tap(
        (column: SortAddress) => this.getAddressPage(column.active, column.direction)
      )
    )
    .subscribe();
  }

  getControl(index, fieldName) {
    return this.controls.at(index).get(fieldName) as FormControl;
  }

  updateField(index, field) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.dataSource.updateAddresses(index, field, control.value);
    }
  }

  getAddressPage(column: string, direction: string) {
     this.dataSource.getAddresses(column, direction, 1);
  }

  // sendAddressData(data) {
  //   this.service.sendAddressList(data);
  // }
}
