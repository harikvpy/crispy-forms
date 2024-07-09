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
import { errorTailorImports, provideErrorTailorConfig } from '@ngneat/error-tailor';
import {
  CrispyCheckboxComponent,
  CrispyCustomFieldComponent,
  CrispyDateFieldComponent,
  CrispyDateRangeFieldComponent,
  CrispyDivComponent,
  CrispyDynamicControlDirective,
  CrispyFormArrayComponent,
  CrispyInputFieldTypeComponent,
  CrispyMatFormImplComponent,
  CrispyRenderFieldComponent,
  CrispyRowComponent,
  CrispySelectFieldComponent,
  CrispyTemplateFieldComponent
} from './crispy-internal-components';
import { CrispyMatFormComponent } from './crispy-mat-form.component';
import { CrispyFieldNameDirective } from './field-name.directive';
import { MatErrorTailorControlErrorComponent } from './mat-error-tailor-error.component';

@NgModule({
  declarations: [
    CrispyFieldNameDirective,
    CrispyMatFormComponent,
    CrispyFormArrayComponent,
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
    CrispyMatFormImplComponent,
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
  exports: [
    CrispyFieldNameDirective,
    CrispyMatFormComponent,
    MatErrorTailorControlErrorComponent,
  ],
  providers: [
    provideErrorTailorConfig({
      blurPredicate(element: Element) {
        return (
          element.tagName === 'INPUT' ||
          element.tagName === 'SELECT' ||
          element.tagName === 'MAT-SELECT' ||
          element.tagName === 'MAT-DATE-RANGE-INPUT'
        );
      },
      controlErrorComponent: MatErrorTailorControlErrorComponent,
      errors: {
        useValue: {}
      },
    }),
  ],
})
export class CrispyMatFormModule {}
