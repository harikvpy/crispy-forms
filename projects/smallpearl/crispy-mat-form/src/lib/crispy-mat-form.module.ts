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
  CrispyFieldNameDirective,
} from './crispy-mat-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  CrispyCheckboxComponent,
  CrispyCustomFieldComponent,
  CrispyDateFieldComponent,
  CrispyDateRangeFieldComponent,
  CrispyDynamicControlDirective,
  CrispyInputFieldTypeComponent,
  CrispySelectFieldComponent,
} from './crispy-internal-components';

@NgModule({
  declarations: [
    CrispyFieldNameDirective,
    CrispyMatFormComponent,
    CrispySelectFieldComponent,
    CrispyInputFieldTypeComponent,
    CrispyDateRangeFieldComponent,
    CrispyDateFieldComponent,
    CrispyDynamicControlDirective,
    CrispyCustomFieldComponent,
    CrispyCheckboxComponent,
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
  exports: [CrispyFieldNameDirective, CrispyMatFormComponent],
  providers: [],
})
export class CrispyMatFormModule {}
