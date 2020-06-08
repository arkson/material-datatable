import { CoreService } from './services/core.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DataTableComponent } from './data-table/data-table.component';
import { HttpClientModule } from '@angular/common/http';
import { EditModeDirective } from './directives/edit-mode.directive';
import { EditableOnEnterDirective } from './directives/edit-on-enter.directive';
import { ViewModeDirective } from './directives/view-mode.directive';
import { EditableComponent } from './directives/editable.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    EditableComponent,
    EditModeDirective,
    EditableOnEnterDirective,
    ViewModeDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ CoreService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
