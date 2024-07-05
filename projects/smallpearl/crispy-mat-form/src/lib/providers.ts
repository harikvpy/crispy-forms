import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type LABEL_FN = (fieldName: string) => string;

export interface CrispyFormsConfig {
  /**
   * Function that returns label of a field, if one is not explicitly
   * specified in `CrispyField.label`.
   */
  labelFn?: LABEL_FN;
  /**
   * Unused in V2
   */
  defaultCssClass?: string;
  /**
   * 
   */
  groupArrayConfig?: {
    addRowText?: string|Observable<string>;
  },
}

export const CRISPY_FORMS_CONFIG_PROVIDER = new InjectionToken<CrispyFormsConfig>(
  'CrispyFormsConfigProvider'
);
