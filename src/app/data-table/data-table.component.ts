import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AddressDataService } from '../services/address-data.service';
import { AddressDataSource } from './../services/address-datasource';
import { TableVirtualScrollStrategy } from '../services/virtual-scroll.service';
import { SortAddress, Address } from '../models/';

import { Observable, of, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: TableVirtualScrollStrategy
  }]
})
export class DataTableComponent implements OnInit, AfterViewInit {

  dataSource: AddressDataSource;
  columnsToDisplay: string[] = [ 'streetNumber', 'street', 'city', 'zipCode', 'state' ];
  addressList: Address[];
  controls: FormArray;
  toGroups: FormGroup[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(VIRTUAL_SCROLL_STRATEGY) private readonly scrollStrategy: TableVirtualScrollStrategy,
    private addressDataService: AddressDataService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {

    this.dataSource = new AddressDataSource(this.addressDataService, this.scrollStrategy);
    this.dataSource.loadAddressList();
    this.dataSource.calculateVirtualScrollSize();

    this.initFormControls();
  }

  ngAfterViewInit(): void {
    this.sortColumns(this.sort);
  }

  initFormControls(): void {
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

  getControl(index: number, fieldName: string): FormControl {
    return this.controls.at(index).get(fieldName) as FormControl;
  }

  updateField(index: number, field: string): void {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.dataSource.updateAddressList(index, field, control.value);
    }
  }

  sortColumns(sort: MatSort): void {
    sort.sortChange.pipe(
      tap(
        (column: SortAddress) => this.getAddressPage(column.active, column.direction)
      )
    )
    .subscribe();
  }

  getAddressPage(column: string, direction: string): void {
     this.dataSource.getAddressList(column, direction, 1);
  }

  onSubmit(): void {
    this.dataSource.sendAddressList();
    this.dataSource.status.file.progress
      .subscribe(val => { if (val === 100) {
        this.openSnackBar('File uploaded successfully!', 'custom-snackbar');
      }});
  }

  openSnackBar(message: string, className: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: [className]
    });
  }

}