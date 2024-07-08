import { Injectable, Injector } from '@angular/core';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { buildFormGroup, safeGetCrispyConfig } from './crispy-internal-components';
import { CrispyDiv } from './crispy-mat-form-helper';
import { CrispyField } from './crispy-types';

@Injectable({ providedIn: 'any' })
export class CrispyBuilder {
  constructor(private injector: Injector) {}

  build(
    field: CrispyField | CrispyField[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    const config = safeGetCrispyConfig(this.injector);
    if (Array.isArray(field)) {
      field = CrispyDiv(config.defaultContainerCssClass!, field);
    }
    const fg = new FormGroup({}, validatorOrOpts, asyncValidator);
    return {
      form: buildFormGroup(
        [field],
        fg,
        config.defaultRowCssClass!,
        config.numberOfColsPerRow!,
        config.defaultColDivCssClassTemplate!
      ),
      field,
      fieldCssClass: '',
    };    
  }
}
