import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  CrispyMatFormComponent,
  CrispySelectFieldComponent,
  CrispyInputFieldTypeComponent,
  CrispyDateRangeFieldComponent,
  CrispyDateFieldComponent,
  CrispyCustomFieldComponent,
  CrispyDynamicControlDirective,
  CrispyFieldNameDirective,
  CrispyCheckboxComponent,
} from './crispy-mat-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    CrispyFieldNameDirective,
    CrispyInputFieldTypeComponent,
    CrispySelectFieldComponent,
    CrispyDateRangeFieldComponent,
    CrispyDateFieldComponent,
    CrispyDynamicControlDirective,
    CrispyCustomFieldComponent,
    CrispyCheckboxComponent,
    CrispyMatFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
  exports: [
    CrispyFieldNameDirective,
    CrispyMatFormComponent,
  ],
  providers: [],
})
export class CrispyMatFormModule { }
