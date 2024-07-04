import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { errorTailorImports } from '@ngneat/error-tailor';
import {
  CrispyCheckboxComponent,
  CrispyCustomFieldComponent,
  CrispyDateFieldComponent,
  CrispyDateRangeFieldComponent,
  CrispyDivComponent,
  CrispyDynamicControlDirective,
  CrispyInputFieldTypeComponent,
  CrispyMatFormArrayComponent,
  CrispyRenderFieldComponent,
  CrispyRowComponent,
  CrispySelectFieldComponent,
  CrispyTemplateFieldComponent
} from './crispy-internal-components';
import {
  CrispyMatFormComponent,
} from './crispy-mat-form.component';
import { CrispyFieldNameDirective } from './field-name.directive';
import { MatErrorTailorControlErrorComponent } from './mat-error-tailor-error.component';

@NgModule({
  declarations: [
    CrispyFieldNameDirective,
    CrispyMatFormComponent,
    CrispyMatFormArrayComponent,
    CrispySelectFieldComponent,
    CrispyInputFieldTypeComponent,
    CrispyDateRangeFieldComponent,
    CrispyDateFieldComponent,
    CrispyDynamicControlDirective,
    CrispyCustomFieldComponent,
    CrispyCheckboxComponent,
    CrispyTemplateFieldComponent,
    CrispyRenderFieldComponent,
    CrispyDivComponent,
    CrispyRowComponent,
    MatErrorTailorControlErrorComponent,
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
    errorTailorImports,
  ],
  exports: [CrispyFieldNameDirective, CrispyMatFormComponent, MatErrorTailorControlErrorComponent],
  providers: [
    // provideErrorTailorConfig({
    //   controlErrorComponent: CrispyControlErrorComponent,
    // })
  ],
})
export class CrispyMatFormModule {}
