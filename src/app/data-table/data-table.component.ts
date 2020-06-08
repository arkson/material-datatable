import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { CoreService } from './../services/core.service';
import { BehaviorSubject } from 'rxjs';

import { Address } from '../models/address';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  columnsToDisplay: string[] = [ 'streetNumber', 'street', 'city', 'state', 'zipCode' ];
  addressList: Address[];
  controls: FormArray;
  toGroups: FormGroup[];

  list$: BehaviorSubject<Address[]>;

  constructor(private service: CoreService) {
  }

  ngOnInit(): void {
    this.service.fetchAddressList().subscribe((response: Address[]) => {
      this.addressList = response;
      this.list$ = new BehaviorSubject(this.addressList);

      this.toGroups = response.map(entity => {
        return new FormGroup({
          streetNumber:  new FormControl(entity.streetNumber, Validators.required),
          street: new FormControl(entity.street, Validators.required),
          city: new FormControl(entity.city, Validators.required),
          zipCode: new FormControl(entity.zipCode, Validators.required),
          state: new FormControl(entity.state, Validators.required)
        }, {updateOn: 'blur'});
      });

      this.controls = new FormArray(this.toGroups);
    });
  }

  updateField(index, field) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.update(index, field, control.value);
    }

   }

   update(index, field, value) {
    this.addressList = this.addressList.map((e, i) => {
      if (index === i) {
        return {
          ...e,
          [field]: value
        };
      }
      return e;
    });
    this.list$.next(this.addressList);
  }

  getControl(index, fieldName) {
    return this.controls.at(index).get(fieldName) as FormControl;
  }

}
